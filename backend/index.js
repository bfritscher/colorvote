import { Server } from "socket.io";
import { SignJWT, jwtVerify } from "jose";
import { readFile, writeFile } from "fs/promises";
import { throttle } from "throttle-debounce";

const JWT_SECRET = process.env.JWT_SECRET || "dev_too_short_secret";
const JWT_ISSUER = process.env.JWT_ISSUER || "colorvote.ch";
const BACKEND_FILE = process.env.BACKEND_FILE || "./data/db.json";
const PRUNE_SAVE_INTERVAL = process.env.PRUNE_SAVE_INTERVAL ? parseInt(process.env.PRUNE_SAVE_INTERVAL, 10) : 1000 * 60 * 60;
const COLORVOTE_THROTTLE_MS =  process.env.COLORVOTE_THROTTLE_MS ? parseInt(process.env.COLORVOTE_THROTTLE_MS, 10) : 1000;
const SERVER_PORT = process.env.SERVER_PORT || 3002;

import * as Sentry from "@sentry/node";
// Importing @sentry/tracing patches the global hub for tracing to work.
import * as Tracing from "@sentry/tracing";
Sentry.init({
  dsn: "https://7c90d38260104b5189bc876ab6d10a16@sentry.j42.org/21",
  tracesSampleRate: 1.0,
});

const db = {
  rooms: {},
};

try {
  const file = await readFile(BACKEND_FILE, "utf8");
  db.rooms = JSON.parse(file);
} catch (err) {
  console.log("No db file found");
}

async function pruneAndSaveDb() {
  // prune
  const currentTime = new Date().getTime() / 1000;
  Object.keys(db.rooms).forEach((roomName) => {
    const room = db.rooms[roomName];
    if (room.exp < currentTime) {
      delete db.rooms[roomName];
      io.to(roomName).emit("close");
      io.to(`${roomName}-admin`).emit("close");
    }
  });
  // save
  await writeFile(BACKEND_FILE, JSON.stringify(db.rooms));
}
setInterval(pruneAndSaveDb, PRUNE_SAVE_INTERVAL);

function userRoomData(room) {
  return {
    n: room.name,
    s: room.config.status,
    o: room.config.nbOptions,
    i: room.config.sessionId,
  };
}

function adminRoomData(room) {
  return {
    n: room.name,
    s: room.config.status,
    o: room.config.nbOptions,
    i: room.config.sessionId,
    r: room.results,
  };
}

function adminRoomCounts(room) {
  return room.connections;
}

function roomList() {
  // TODO filter rooms to be shown?
  return Object.keys(db.rooms);
}

function createRoom(roomName) {
  const room = {
    name: roomName,
    votes: {},
    connections: 0,
    results: new Array(8).fill(0),
    config: {
      nbOptions: 8,
      status: "open",
      sessionId: new Date().getTime(),
    },
  };
  db.rooms[roomName] = room;
  return room;
}

function configRoom(room, roomConfig) {
  // reset vote
  if (room.config.sessionId !== roomConfig.i) {
    room.results = new Array(8).fill(0);
    room.votes = {};
  }
  room.config.nbOptions = roomConfig.o;
  room.config.status = roomConfig.s;
  room.config.sessionId = roomConfig.i;
  return room;
}

function registerVote(room, userId, vote) {
  if (room.config.status === "open") {
    if (room.votes.hasOwnProperty(userId)) {
      const oldVote = room.votes[userId];
      room.results[oldVote]--;
    }
    room.votes[userId] = vote;
    room.results[vote]++;
  }
}

function createToken(roomName, exp) {
  return new SignJWT({ r: roomName })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(exp)
    .sign(Uint8Array.from(JWT_SECRET));
}

async function verifyToken(token) {
  // override
  if (token.startsWith("SUPERUSER")) {
    const data = token.split("|");
    if (data[2] === JWT_SECRET) {
      return data[1];
    }
  }
  try {
    const { payload } = await jwtVerify(token, Uint8Array.from(JWT_SECRET), {
      issuer: JWT_ISSUER,
    });
    return payload.r;
  } catch (err) {
    return undefined;
  }
}

const io = new Server({
  cors: {
    origin: [
      "https://colorvote.ch",
      "http://localhost:5000",
      "http://localhost:3001",
      "http://localhost:3001",
    ],
  },
  serveClient: false,
});

io.on("connection", (socket) => {
  // setup communication
  socket.on("join", async (roomName, token) => {
    if (!roomName || roomName.endsWith("-admin")) {
      return socket.emit("error", "Not allowed to join this room");
    }
    if (!db.rooms.hasOwnProperty(roomName)) {
      return socket.emit("error", "Room does not exist");
    }
    const room = db.rooms[roomName];

    // admin or normal user
    if (token) {
      const validRoomName = await verifyToken(token);
      if (validRoomName === roomName) {
        socket.join(`${roomName}-admin`);
        socket.emit("info", adminRoomData(room));
        socket.emit("count", adminRoomCounts(room));
      } else {
        return socket.emit("error", "Permission denied!");
      }
    } else {
      socket.join(roomName);
      socket.emit("info", userRoomData(room));
      socket.room = roomName;
      room.connections++;
      io.to(`${roomName}-admin`).emit("count", adminRoomCounts(room));
    }
  });

  socket.on("leave", (roomName) => {
    socket.rooms.forEach((rname) => {
      if (rname === `${roomName}-admin`) {
        socket.leave(rname);
      } else if (rname === roomName) {
        socket.leave(rname);
        const room = db.rooms[roomName];
        if (room) {
          socket.room = undefined;
          room.connections--;
          io.to(`${roomName}-admin`).emit("count", adminRoomCounts(room));
        }
      }
    });
  });

  socket.on("create", async (roomName, callback) => {
    if (db.rooms.hasOwnProperty(roomName)) {
      return socket.emit("error", "Room does already exist");
    }
    // exp 1h
    const exp = new Date().getTime() / 1000 + 3600;
    const token = await createToken(roomName, exp);
    const room = createRoom(roomName);
    room.exp = exp;
    callback(token);
    io.emit("rooms", roomList());
    pruneAndSaveDb();
  });

  socket.on("extend", async (token, callback) => {
    if (token) {
      const validRoomName = await verifyToken(token);
      if (!validRoomName) {
        return socket.emit("error", "Permission denied!");
      }
      const room = db.rooms[validRoomName];
      // + 1h
      const exp = room.exp + 3600;
      const newToken = await createToken(validRoomName, exp);
      room.exp = exp;
      callback(newToken);
      io.to(validRoomName).emit("info", userRoomData(room));
      io.to(`${validRoomName}-admin`).emit("info", adminRoomData(room));
      pruneAndSaveDb();
    }
  });

  socket.on("config", async (roomConfig, token) => {
    if (token) {
      const validRoomName = await verifyToken(token);
      if (!validRoomName) {
        return socket.emit("error", "Permission denied!");
      }
      const room = db.rooms[validRoomName];
      configRoom(room, roomConfig);
      io.to(validRoomName).emit("info", userRoomData(room));
      io.to(`${validRoomName}-admin`).emit("info", adminRoomData(room));
    }
  });

  socket.on("close", async (token) => {
    if (token) {
      const validRoomName = await verifyToken(token);
      if (!validRoomName) {
        return socket.emit("error", "Permission denied!");
      }
      delete db.rooms[validRoomName];
      socket.emit("rooms", roomList());
      io.to(validRoomName).emit("closed");
      io.to(`${validRoomName}-admin`).emit("closed");
      pruneAndSaveDb();
    }
  });

  const updateAdminVoteInfoThrottled = throttle(
    COLORVOTE_THROTTLE_MS,
    (roomName) => {
      const room = db.rooms[roomName];
      if (room) {
        io.to(`${room.name}-admin`).emit("info", adminRoomData(room));
      }
    }
  );

  socket.on("vote", (roomName, userId, vote) => {
    if (!db.rooms.hasOwnProperty(roomName)) {
      return socket.emit("error", "Room does not exist");
    }
    const room = db.rooms[roomName];
    registerVote(room, userId, vote);
    updateAdminVoteInfoThrottled(room.name);
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      const room = db.rooms[socket.room];
      if (room) {
        room.connections--;
        io.to(`${room.name}-admin`).emit("count", adminRoomCounts(room));
      }
    }
  });

  socket.emit("rooms", roomList());
});
console.log(`Listening on port ${SERVER_PORT}`);
io.listen(SERVER_PORT);

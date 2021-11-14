import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";
import { reactive } from "vue";
import router from "./router";

const COLORVOTE_UUID = "COLORVOTE_UUID";
const COLORVOTE_TOKENS = "COLORVOTE_TOKENS";
const SOCKET_URL = "localhost:3002";

export const state = reactive({
  roomName: "",
  rooms: [],
  userId: ensureId(),
  tokens: loadTokens(),
  connected: false,
  error: null,
  count: 0,
});

function ensureId() {
  const id = localStorage.getItem(COLORVOTE_UUID);
  if (id) {
    return id;
  }
  const newId = uuidv4();
  localStorage.setItem(COLORVOTE_UUID, newId);
  return newId;
}

function loadTokens() {
  const oldTokens = JSON.parse(localStorage.getItem(COLORVOTE_TOKENS) || "[]");
  const tokens = {};
  oldTokens.forEach((token) => {
    const decoded = jwt_decode(token);
    if (decoded.exp > Date.now() / 1000) {
      tokens[decoded.r] = token;
    }
  });
  return tokens;
}

function saveTokens() {
  localStorage.setItem(
    COLORVOTE_TOKENS,
    JSON.stringify(Object.values(state.tokens))
  );
}

export function getToken(roomName) {
  const secret = localStorage.getItem("COLORVOTE_SUPERUSER")
  if (secret) {
    return `SUPERUSER|${roomName}|${secret}`
  }
  return state.tokens[roomName];
}

function convertRoom(room) {
  return {
    name: room.n,
    status: room.s,
    sessionId: room.i,
    nbOptions: room.o,
    results: room.r,
  };
}

const socket = io(SOCKET_URL);
socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("error", (err) => {
  state.error = err;
  router.push("/");
});

socket.on("count", (count) => {
  state.count = count;
});

socket.on("rooms", (rooms) => {
  state.rooms = rooms;
});

socket.on("info", (room) => {
  state.error = null;
  state.room = convertRoom(room);
  // redirect to room page after making a join request
  if (
    !router.currentRoute.params ||
    router.currentRoute.params.roomName != state.room.name
  ) {
    let url = `/${state.room.name}`;
    if (state.room.results) {
      url += "/admin";
    }
    router.push(url);
  }
});

socket.on("closed", () => {
  state.room = null;
  router.push("/");
});

export function joinRoom(roomName, token) {
  socket.emit("join", roomName, token);
}

export function leaveRoom(roomName) {
  socket.emit("leave", roomName);
}

export function createRoom() {
  const roomName = prompt("Nom de la salle?");
  if (!roomName) return;
  socket.emit("create", roomName, (token) => {
    state.tokens[roomName] = token;
    saveTokens();
    joinRoom(roomName, token);
  });
}

export function extendRoom() {
  const roomName = state.room?.name;
  socket.emit("extend", getToken(roomName), (token) => {
    state.tokens[roomName] = token;
    saveTokens();
  });
}

export function closeRoom() {
  const roomName = state.room?.name;
  socket.emit("close", getToken(roomName));
  delete state.tokens[roomName];
  saveTokens();
}

export function sendCurrentRoomConfig() {
  socket.emit(
    "config",
    {
      s: state.room.status,
      o: state.room.nbOptions,
      i: state.room.sessionId,
    },
    getToken(state.room?.name)
  );
}

export function sendVote(vote) {
  socket.emit("vote", state.room?.name, state.userId, vote);
}

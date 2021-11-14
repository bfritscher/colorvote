<template>
  <div>
    <logo></logo>
    <router-link class="about" to="/about" title="about">about</router-link>

    <div class="rooms">
      <div class="room add-room" @click="createRoom()">+ Créer un Vote</div>
      <div
        v-for="room in rooms"
        :key="room.name"
        class="room"
        @click="joinRoom(room.name)"
      >
        {{ room.name }}
        <span
          v-if="room.admin"
          class="rename-room"
          @click.stop="joinRoom(room.name, room.admin)"
          >admin</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { state, createRoom, joinRoom, getToken } from "../state";
import Logo from "./Logo.vue";
import { computed } from "vue";

export default {
  name: "Home",
  components: {
    Logo,
  },
  setup() {
    const rooms = computed(() => {
      const rooms = state.rooms.map((roomName) => {
        return {
          name: roomName,
          admin: getToken(roomName),
        };
      });
      rooms.sort((a, b) => a.name.localeCompare(b.name));
      return rooms;
    });

    return {
      rooms,
      createRoom,
      joinRoom,
    };
  },
};
</script>

<style>
.rooms {
  clear: both;
  background-color: #000;
}

.room {
  font-weight: bold;
  padding: 16px;
  font-size: 24px;
  line-height: 36px;
  color: #fff;
  cursor: pointer;
  -webkit-transition: all 0.5s linear;
  -moz-transition: all 0.5s linear;
  -ms-transition: all 0.5s linear;
  -o-transition: all 0.5s linear;
  transition: all 0.5s linear;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.6);
}

.room:hover {
  opacity: 0.7;
}

.room .rename-room {
  float: right;
  font-size: 70%;
  font-weight: normal;
  opacity: 0.8;
}
</style>

<template>
  <div style="display:flex;flex-direction:column;height:100%;">
    <logo></logo>
    <div class="room-title">{{ state.room?.name }}</div>
    <div class="room-stats">
      {{ votesTotal }}<br />
      <span>{{ state.count }}</span>
    </div>
    <div v-if="state.room" id="voting-admin-panel">
      <span class="timer">{{ elapsedTime }}</span>
      <button
        id="questionAction"
        :class="{
          new: state.room.status === 'closed',
          stop: state.room.status != 'closed',
        }"
        @click="switchStatus()"
      >
        {{ (state.room.status == "closed" && "NOUVEAU") || "TERMINER" }}
      </button>

      votes: <span class="votesCount">{{ votesTotal }}</span>

      <vue-qrcode
        id="showqrcode"
        title="afficher le QRCode"
        :value="href"
        :width="40"
        type="image/png"
        :color="{ dark: '#000000ff', light: '#ffffffff' }"
        :quality="0.92"
        @click="ui.showqrcode = !ui.showqrcode"
      />
      <img
        id="toggleResults"
        alt="afficher résultats"
        title="afficher résultats"
        src="../assets/chart_icon.png"
        @click="ui.showresults = !ui.showresults"
      />
      <router-link class="backLink" to="/">&lt;</router-link>
    </div>
    <div v-if="ui.showresults && state.room" class="liveresults">
      <chart :data="state.room.results.slice(0, state.room.nbOptions)"></chart>
      <div v-if="state.room.status == 'open'">
        <label
          >nombres de choix
          <input
            type="range"
            step="1"
            min="2"
            max="8"
            v-model.number="state.room.nbOptions"
            @change="sendCurrentRoomConfig()"
          />
          {{ state.room.nbOptions }}
        </label>
      </div>
    </div>
    <div style="flex: 1;"></div>
    <div id="advanced_options">
      Room expires {{ remainingTime }}
      <button @click="extendRoom">extend +1h</button>
      <button @click="confirmDestroy">destroy room</button>
    </div>
    <div v-if="ui.showqrcode" id="qrCodePanel" @click="ui.showqrcode = false">
      <vue-qrcode
        :value="href"
        :width="400"
        type="image/png"
        :color="{ dark: '#000000ff', light: '#ffffffff' }"
        :quality="0.92"
      />
      <h1 class="user-select" @click.stop="">{{ href }}</h1>
    </div>
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect,
} from "vue";
import VueQrcode from "vue-qrcode";
import { useRoute } from "vue-router";
import {
  joinRoom,
  leaveRoom,
  state,
  sendCurrentRoomConfig,
  closeRoom,
  extendRoom,
  getToken,
} from "../state";
import Chart from "./Chart.vue";
import Logo from "./Logo.vue";
import jwt_decode from "jwt-decode";
import moment from "moment";

export default {
  name: "Asker",
  components: {
    VueQrcode,
    Chart,
    Logo,
  },
  setup() {
    const route = useRoute();
    watchEffect(() => {
      if (route.params.roomName !== state.room?.name) {
        if (state.room) {
          leaveRoom(state.room.name);
        }
        if (route.params.roomName) {
          joinRoom(route.params.roomName, getToken(route.params.roomName));
        }
      }
    });

    const ui = reactive({
      showqrcode: false,
      showresults: false,
    });
    const href = computed(() => {
      return `${window.location.origin}/${state.room?.name}`;
    });

    const votesTotal = computed(() => {
      return Object.values(state.room?.results || {}).reduce(
        (acc, vote) => acc + vote,
        0
      );
    });

    const exp = computed(() => {
      try {
        const decoded = jwt_decode(state.tokens[state.room?.name]);
        return new Date(decoded.exp * 1000);
      } catch (e) {
        return new Date();
      }
    });

    function padLeft(number, size) {
      number = number.toString();
      while (number.length < size) {
        number = "0" + number;
      }
      return number;
    }

    function calculateTimer() {
      let time = moment().diff(state.room.sessionId);
      time = Math.round(time / 1000);
      const secondes = time % 60;
      return padLeft((time - secondes) / 60, 2) + ":" + padLeft(secondes, 2);
    }

    let timer;
    const elapsedTime = ref("");
    const remainingTime = ref("");
    onMounted(() => {
      timer = setInterval(() => {
        if (state.room && state.room.status === "open") {
          elapsedTime.value = calculateTimer();
        } else {
          elapsedTime.value = "00:00";
        }
        remainingTime.value = moment(exp.value).fromNow();
      });
    });
    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      href,
      ui,
      state,
      votesTotal,
      remainingTime,
      confirmDestroy() {
        confirm("Are you sure you want to destroy this room?") && closeRoom();
      },
      extendRoom,
      sendCurrentRoomConfig,
      elapsedTime,
      switchStatus() {
        const currentStatus = state.room?.status;
        if (currentStatus === "closed") {
          // starting a new question
          // hide by default
          ui.showresults = false;
          state.room.status = "open";
          state.room.sessionId = new Date().getTime();
        } else {
          // ending the question
          ui.showresults = true;
          state.room.status = "closed";
        }
        sendCurrentRoomConfig();
      },
    };
  },
};
</script>

<style>
#voting-admin-panel {
  text-align: center;
  clear: both;
  background-color: white;
  height: 100px;
  line-height: 100px;
  font-size: 48px;
  position: relative;
}

#voting-admin-panel .backLink {
  color: #ccc;
  font-size: 48px;
  opacity: 1;
  line-height: 70px;
}
#questionAction {
  border: none;
  padding: 10px;
  border-radius: 0;
  font-weight: bold;
  color: #fff;
  font-size: 28px;
  vertical-align: text-bottom;
  margin: 0 20px;
  cursor: pointer;
}

#questionAction.stop {
  background-color: rgb(197, 0, 0);
}
#questionAction.new {
  background-color: rgb(39, 197, 0);
}

#advanced_options {
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  font-size: 80%;
}
#advanced_options button {
  font-size: 80%;
  padding: 5px;
  background: #fff;
  border: 1px solid #ccc;
  margin: 0 5px;
  cursor: pointer;
}

#showqrcode,
#toggleResults,
#toggleHistory {
  cursor: pointer;
  float: right;
  margin-top: 30px;
  margin-right: 15px;
}

.timer {
  font-size: 48px;
}

.liveresults {
  line-height: 26px;
}

.liveresults .chart {
  margin: 20px auto;
}

.liveresults > div {
  background-color: #fff;
  width: 490px;
  margin: auto;
  padding: 5px;
}

.liveresults > div input {
  vertical-align: middle;
}

#qrCodePanel,
#loading {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  top: 0;
  left: 0;
  z-index: 1001;
  text-align: center;
}
#qrCodePanel h1,
#loading h1 {
  margin-top: 60px;
}
#qrCodePanel .qrcode {
  margin-top: 100px;
}
#qrCodePanel .qrcode img {
  margin: auto;
}

#reconnecting {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 600;
  width: 100px;
  color: red;
  text-align: center;
  padding: 1px;
  background: rgba(255, 255, 255, 0.5);
}

.backLink {
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;
  font-size: 42px;
  color: #fff;
  opacity: 0.4;
  cursor: pointer;
  padding: 10px 10px 0 10px;
  text-decoration: none;
}

.room-title {
  width: 60%;
  height: 40px;
  position: absolute;
  z-index: 500;
  top: 12px;
  left: 50%;
  text-align: center;
  font-size: 24px;
  line-height: 28px;
  color: #fff;
  opacity: 0.6;
  margin-left: -30%;
}
.room-stats {
  height: 40px;
  position: absolute;
  z-index: 500;
  top: 10px;
  right: 10px;
  font-size: 14px;
  color: #fff;
  opacity: 0.6;
  line-height: 14px;
  text-align: right;
}
</style>

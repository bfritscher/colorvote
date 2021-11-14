<template>
  <template v-if="state.room">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="50"
      :loop="true"
      :pagination="{ clickable: true }"
      @slideChange="onSlideChange"
      @swiper="setControlledSwiper"
    >
      <swiper-slide v-for="slide in slides" :key="slide.id"
        :class="`color-${slide.id}`"><div class="title">{{ slide.title }}</div></swiper-slide
      >
      ...
    </swiper>
    <div class="room-title">{{ state.room?.name }}</div>
    <div class="show-card-vote" @click="showCardVote = !showCardVote"></div>
    <div
      class="card-vote"
      v-if="showCardVote"
      @click="showCardVote = !showCardVote"
    >
      <div class="card-wrapper" v-for="choice in choices" :key="choice">
        <div
          class="card"
          :class="`color-${choice} ${vote.choice === choice ? 'active' : ''}`"
          @click.stop="setVote(choice)"
        >
          <div class="title">{{ choice }}</div>
        </div>
      </div>
    </div>
    <div class="votenow" v-if="vote.choice === undefined">Votez maintenant</div>
    <div
      class="voting-stopped"
      v-if="!state.room || state.room.status === 'closed'"
    >
      <h1>Votation terminée</h1>
    </div>
    <router-link class="backLink" to="/">&lt;</router-link>
  </template>
</template>

<script>
import { computed, ref, reactive, watchEffect } from "vue";
import { Pagination, Mousewheel, Keyboard, Controller } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";
import { state, joinRoom, sendVote, leaveRoom } from "../state";
import { useRoute } from "vue-router";

const COLORVOTE_VOTE_PREFIX = "COLORVOTE_VOTE_";

export default {
  name: "Voter",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const route = useRoute();
    watchEffect(() => {
      if (route.params.roomName !== state.room?.name) {
        if (state.room) {
          leaveRoom(state.room.name);
        }
        if (route.params.roomName) {
          joinRoom(route.params.roomName);
        }
      }
    });


    const swiper = ref(null);

    const vote = reactive({
      sessionId: undefined,
      choice: undefined,
    });

    const showCardVote = ref(false);

    const choices = computed(() => {
      const choices = [];
      for (let i = 0; i < state.room?.nbOptions; i++) {
        choices.push(i);
      }
      return choices;
    });

    const slides = computed(() => {
      return new Array(state.room?.nbOptions).fill(0).map((_, i) => {
        return {
          id: i,
          title: i,
        };
      });
    });

    const setVote = (choice) => {
      vote.choice = choice;
      if (swiper.value && swiper.value.realIndex !== choice) {
        swiper.value.slideToLoop(choice);
      }
      sendVote(choice);
      // save last vote
      localStorage.setItem(`${COLORVOTE_VOTE_PREFIX}_${state.room.name}`, JSON.stringify(vote));
    };

    watchEffect(() => {
      if (state.room && state.room.sessionId !== vote.sessionId) {
        vote.sessionId = state.room.sessionId;
        vote.choice = undefined;
      }
      const voteData = JSON.parse(localStorage.getItem(`${COLORVOTE_VOTE_PREFIX}_${state.room?.name}`) || "{}");
      if (voteData && state.room && state.room.sessionId === voteData.sessionId) {
        setVote(voteData.choice);
      }
    })

    const onSlideChange = () => {
      if (swiper.value) {
        setVote(swiper.value.realIndex);
      }
    };

    return {
      modules: [Pagination, Mousewheel, Keyboard, Controller],
      slides,
      onSlideChange,
      state,
      showCardVote,
      vote,
      choices,
      setVote,
      setControlledSwiper(s) {
        swiper.value = s;
        if(vote.choice) {
          swiper.value.slideToLoop(vote.choice);
        }
      }
    };
  },
};
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
  color: #fff;
  background: #222;
  text-align: center;
}

.swiper-slide {
  height: 100%;
}

.swiper-slide .title {
  font-size: 120px;
  margin-top: 100px;
  margin-bottom: 0;
  line-height: 120px;
}

.pagination {
  position: absolute;
  z-index: 20;
  left: 0;
  bottom: 15px;
  width: 100%;
}
.swiper-pagination-bullet {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background: #222;
  margin-right: 5px;
  margin-left: 5px;
  opacity: 0.8;
  border: 1px solid #fff;
  cursor: pointer;
}
.swiper-visible-switch {
  background: #aaa;
}
.swiper-pagination-bullet-active {
  background: #fff;
}

.votenow {
  position: absolute;
  top: 65px;
  left: 0;
  width: 100%;
  color: rgb(255, 18, 18);
  text-align: center;
  z-index: 500;
  font-size: 26px;
}

.voting-stopped {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 999;
}

.voting-stopped h1 {
  margin-top: 65px;
  color: rgb(255, 18, 18);
  text-align: center;
}

.card-vote {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 600;
  text-align: center;
  background-color: rgba(165, 165, 165, 0.58);
}
.card-wrapper {
  display: inline-block;
  width: 18%;
  margin: 2% 2%;
  height: 35%;
}

.show-card-vote {
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 10px;
  left: 10px;
  z-index: 610;
  background: url("../assets/cards_icon.png") no-repeat;
  cursor: pointer;
}

.card {
  cursor: pointer;
  position: relative;
  height: 100%;
  margin: 20% 0;
  color: rgba(255, 255, 255, 0.6);
  transition: margin 0.3s;
  -webkit-transition: margin 0.3s;
}

.card .title {
  font-size: 48px;
  line-height: 48px;
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  text-align: center;
}

.card.active {
  margin-top: 0;
  color: rgba(255, 255, 255, 1);
}

@media only screen and (min-height: 550px) {
  .card-vote {
    padding-top: 40px;
    height: -webkit-calc(100% - 40px);
    height: calc(100% - 40px);
  }
}

@media only screen and (min-width: 768px) {
  /* ====================
    WIDE: CSS3 Effects
   ==================== */
  .card .title {
    font-size: 72px;
    line-height: 72px;
  }
}
@media only screen and (min-width: 1140px) {
  /* ===============
    Maximal Width
   =============== */
  .card .title {
    font-size: 120px;
    line-height: 120px;
  }
}
</style>

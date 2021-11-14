<template>
  <div class="wrapper">
    <div v-if="state.error" id="errormsg">
      {{ state.error }}
    </div>
    <div id="reconnecting" v-if="!state.connected">reconnecting</div>

    <router-view></router-view>
  </div>
</template>

<script>
import { state } from "./state";

export default {

  setup() {
    return {
      state,
    };
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font: 16px/26px "Roboto", Helvetica, "Helvetica Neue", Arial;
  background-color: #78c5d6;
}

.wrapper {
  height: 100%;
}

html,
button,
input,
select,
textarea {
  color: #222;
}

img {
  vertical-align: middle;
}

#errormsg {
  color: white;
  background: red;
  z-index: 99;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  padding: 4px;

}

.about {
  display: block;
  position: absolute;
  z-index: 500;
  top: 0;
  right: 0;
  padding: 27px 10px 8px 10px;
  text-align: right;
  font-size: 14px;
  color: #fff;
  opacity: 0.6;
  text-decoration: none;
}

.about:hover {
  opacity: 1;
}

svg .color-0 {
  fill: rgb(86, 65, 222);
}
svg .color-1 {
  fill: rgb(255, 62, 221);
}
svg .color-2 {
  fill: rgb(239, 26, 43);
}
svg .color-3 {
  fill: rgb(255, 104, 37);
}
svg .color-4 {
  fill: #f5d63d;
}
svg .color-5 {
  fill: rgb(122, 221, 111);
}
svg .color-6 {
  fill: rgb(13, 209, 255);
}
svg .color-7 {
  fill: rgb(194, 225, 245);
}

.color-0,
.room:nth-child(8n + 1) {
  background-color: rgb(86, 65, 222);
  background-color: #bf62a6;
}
.color-1,
.room:nth-child(8n + 2) {
  background-color: rgb(255, 62, 221);
  background-color: #e868a2;
}
.color-2,
.room:nth-child(8n + 3) {
  background-color: rgb(239, 26, 43);
  background-color: #f28c33;
}
.color-3,
.room:nth-child(8n + 4) {
  background-color: rgb(255, 104, 37);
  background-color: #f5d63d;
}
.color-4,
.room:nth-child(8n + 5) {
  background-color: rgb(246, 246, 123);
  background-color: #c5d647;
}
.color-5,
.room:nth-child(8n + 6) {
  background-color: rgb(122, 221, 111);
  background-color: #79c267;
}
.color-6,
.room:nth-child(8n + 7) {
  background-color: rgb(13, 209, 255);
  background-color: #459ba8;
}
.color-7,
.room:nth-child(8n + 8) {
  background-color: rgb(194, 225, 245);
  background-color: #78c5d6;
}

.color-0 {
  background-color: rgb(86, 65, 222);
}
.color-1 {
  background-color: rgb(255, 62, 221);
}
.color-2 {
  background-color: rgb(239, 26, 43);
}
.color-3 {
  background-color: rgb(255, 104, 37);
}
.color-4 {
  background-color: #f5d63d;
}
.color-5 {
  background-color: rgb(122, 221, 111);
}
.color-6 {
  background-color: rgb(13, 209, 255);
}
.color-7 {
  background-color: rgb(194, 225, 245);
}
*:not(input) {
  user-select: none;
}

.user-select {
  user-select: all;
}
</style>

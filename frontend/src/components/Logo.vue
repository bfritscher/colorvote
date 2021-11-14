<template>
  <div>
    <h1 class="logo"><router-link to="/">ColorVote</router-link></h1>
    <div id="logo">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {

  },
}
</script>

<style scoped>
h1.logo {
  position: absolute;
  top: 0.67em;
  left: 16px;
  color: white;
  margin: 0;
  cursor: pointer;
}

h1.logo a {
  color: white;
  text-decoration: none;
}

#logo {
  background-color: #bf62a6;
  height: 60px;
}

#logo div {
  float: left;
  height: 60px;
}

#logo div:nth-child(1) {
  background-color: #78c5d6;
  width: 25%;
}
#logo div:nth-child(2) {
  background-color: #459ba8;
  width: 19.7%;
}
#logo div:nth-child(3) {
  background-color: #79c267;
  width: 15.5%;
}
#logo div:nth-child(4) {
  background-color: #c5d647;
  width: 12.2%;
}
#logo div:nth-child(5) {
  background-color: #f5d63d;
  width: 9.6%;
}
#logo div:nth-child(6) {
  background-color: #f28c33;
  width: 7.5%;
}
#logo div:nth-child(7) {
  background-color: #e868a2;
  width: 5.9%;
}
#logo div:nth-child(8) {
  background-color: #bf62a6;
  width: 4.6%;
}
</style>

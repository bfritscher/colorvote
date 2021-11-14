import * as VueRouter from "vue-router";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Voter from "./components/Voter.vue";
import Asker from "./components/Asker.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/:roomName/admin", component: Asker, name: "asker" },
  { path: "/:roomName", component: Voter, name: "voter" },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;

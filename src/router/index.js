import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "SubConverter",
    component: () => import("../views/Subconverter.vue")
  },
  {
    path: "/clients",
    name: "Clients",
    component: () => import("../views/Clients.vue")
  },
  {
    path: "/help",
    name: "Help",
    component: () => import("../views/Help.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

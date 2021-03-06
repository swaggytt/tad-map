import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import twitter from "vue-twitter";

Vue.use(VueRouter);
Vue.use(twitter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/landing",
    name: "Landing",
    component: () => import("../views/Landing.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

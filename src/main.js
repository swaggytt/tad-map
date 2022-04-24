import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import LongdoMap from "longdo-map-vue";

Vue.use(LongdoMap, {
  load: {
    apiKey: "7426d185eb598a2d0468178e0d8f0ecb",
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

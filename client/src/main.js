import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueRouter from "vue-router";

Vue.config.productionTip = process.env.NODE_ENV === "prod";

Vue.use(VueRouter);
import func from "@/lib/globalFunc.js";
import btn from "@/components/btn.vue";
import Modal from "@/components/modal.vue";

Vue.prototype.$func = func;
Vue.component("btn", btn);
Vue.component("Modal", Modal);
const app = new Vue({
  render: (h) => h(App),
  router,
  store,
});

app.$mount("#app");

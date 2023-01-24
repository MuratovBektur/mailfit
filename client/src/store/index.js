import Vue from "vue";
import Vuex from "vuex";
import note from "./note.js";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    note,
  },
});

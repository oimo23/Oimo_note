import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import "./assets/styles.css";

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})

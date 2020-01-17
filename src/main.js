// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import jQuery from "jquery";
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'



window.jQuery = window.$ = jQuery
require('bootstrap')
require('bootstrap/dist/css/bootstrap.css')

Vue.use(vueResource)
Vue.use(Datetime)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

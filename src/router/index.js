import Vue from 'vue'
import Router from 'vue-router'
import trackingTime from '@/components/trackingTime'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'trackingTime',
      component: trackingTime
    }
  ]
})

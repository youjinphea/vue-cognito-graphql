import Vue from 'vue'
import App from './App.vue'

import Amplify, { Auth } from 'aws-amplify'
import aws_exports from './aws-exports'
import router from './router'
import store from './store'
Amplify.configure(aws_exports)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

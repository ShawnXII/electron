import Vue from 'vue'

import App from './App'

import 'element-ui/lib/theme-chalk/index.css'

import ElementUi from 'element-ui'

Vue.config.productionTip = false

Vue.use(ElementUi)
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')

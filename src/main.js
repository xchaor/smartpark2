import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import '@/style/global.css'
import '@/style/normalize.css'
//引入flexiblejs自适应
import'@/utils/index'


createApp(App).use(store).use(router).mount('#app')


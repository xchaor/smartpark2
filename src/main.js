import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import '@/style/global.css'
import '@/style/normalize.css'
//引入flexiblejs自适应
import'@/utils/index'
//引入vant组件库
import { Button, Popup,Cell, CellGroup,DropdownMenu, DropdownItem ,DatetimePicker,ActionSheet,NavBar,Dialog } from 'vant';

const app = createApp(App);
app.use(Button)
.use(Popup)
.use(Cell)
.use(CellGroup)
.use(DropdownMenu)
.use(DropdownItem)
.use(DatetimePicker)
.use(ActionSheet)
.use(NavBar)
.use(Dialog);
app.use(store).use(router)
app.mount('#app')


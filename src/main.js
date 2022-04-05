import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'
import router from '@/router'
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import moment from 'moment'
import '@/assets/css/style.less'
import '@/assets/font/iconfont.css'
import store from '@/store'

const app = createApp(App)
app.use(Avue, {size: 'small',});
app.use(router)
app.use(store)
app.use(moment)
app.config.globalProperties.$moment = moment
app.use(ElementPlus)
app.config.silent = true
// 统一注册el-icon图标
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}


app.mount('#app')

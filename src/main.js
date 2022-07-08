import '@/assets/css/style.less'
import '@/assets/font/iconfont.css'

import {createApp} from 'vue'
import App from './App.vue'
import store from '@/store'
import _ from 'lodash'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import router from '@/router'
import moment from 'moment'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

const app = createApp(App)

app.use(store)

app.use(_)
app.config.globalProperties.$_ = _

app.use(mavonEditor)

app.use(Avue, {size: 'small',});

app.use(router)

app.use(moment)
app.config.globalProperties.$moment = moment

app.use(ElementPlus)
// 统一注册el-icon图标
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}

app.config.silent = true

app.mount('#app')

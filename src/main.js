import '@/assets/css/style.less'
import '@/assets/font/iconfont.css'

import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

import store from '@/store'

app.use(store)

import _ from 'lodash'

app.use(_)
app.config.globalProperties.$_ = _

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

app.use(mavonEditor)

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';

app.use(Avue, {size: 'small',});

import router from '@/router'

app.use(router)

import moment from 'moment'

app.use(moment)
app.config.globalProperties.$moment = moment

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

app.use(ElementPlus)
// 统一注册el-icon图标
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}

app.config.silent = true

app.mount('#app')

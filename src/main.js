import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

const app = createApp(App)

import router from '@/router'

app.use(router)
app.use(ElementPlus)
// 统一注册el-icon图标
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}


app.mount('#app')

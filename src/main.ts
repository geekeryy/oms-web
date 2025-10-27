import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// element-plus
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as ElementPlusMessages from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

const app = createApp(App)

// element-plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)

app.use(router)
app.mount('#app')

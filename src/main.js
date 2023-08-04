import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(bootstrap)
app.mount('#app')
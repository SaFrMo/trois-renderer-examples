import { createApp } from 'trois-renderer'
import App from './App.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const app = createApp(App)

app.extend?.({ OrbitControls })

app.mount('#app')

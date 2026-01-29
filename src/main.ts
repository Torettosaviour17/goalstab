import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import './style.css'

// Create app instance
const app = createApp(App)

// Initialize Pinia with persistence
const pinia = createPinia()

// Register plugins
app.use(pinia)
app.use(router)
app.use(MotionPlugin)

// Mount app
app.mount('#app')

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

// Global performance marks
if (import.meta.env.DEV) {
  console.log(`GoalTabs v${import.meta.env.PACKAGE_VERSION || '1.0.0'}`)
  console.log('Environment:', import.meta.env.MODE)
}
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/main.css'

async function main() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
  }

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(VueQueryPlugin, { enableDevtoolsV6Plugin: true })

  await useAuthStore(pinia).fetchMe()

  app.mount('#app')
}

main()

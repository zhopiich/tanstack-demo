import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
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
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

main()

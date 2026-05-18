import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'

import { queryClient } from './queryClient'
import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/main.css'

async function main() {
  const app = createApp(App)

  const shouldUseMsw = import.meta.env.DEV || import.meta.env.VITE_USE_MSW === 'true'

  if (shouldUseMsw) {
    const { MockPlugin } = await import('./mocks/panel-plugin')
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    })
    app.use(MockPlugin)
  }

  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(VueQueryPlugin, { enableDevtoolsV6Plugin: true, queryClient })

  await useAuthStore(pinia).fetchMe()

  app.mount('#app')
}

main()

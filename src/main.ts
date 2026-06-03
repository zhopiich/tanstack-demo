import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import { notifyUnauthorized, onUnauthorized } from './api/auth-token'
import { tryRefresh } from './api/client'
import App from './App.vue'
import { queryClient } from './queryClient'
import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/main.css'

async function main() {
  const app = createApp(App)

  const shouldUseMsw = import.meta.env.VITE_USE_MSW === 'true'

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
  app.use(VueQueryPlugin, { enableDevtoolsV6Plugin: true, queryClient })

  const auth = useAuthStore()

  onUnauthorized(() => {
    auth.reset()
    router.push('/login')
  })

  const refreshed = await tryRefresh()
  if (refreshed) {
    await auth.fetchMe()
  }

  app.use(router)

  app.mount('#app')

  if (!refreshed) {
    notifyUnauthorized()
  }
}

main()

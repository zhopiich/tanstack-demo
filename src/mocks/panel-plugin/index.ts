import { createApp, h } from 'vue'
import MockPanel from './MockPanel.vue'

export const MockPlugin = {
  install() {
    if (!import.meta.env.DEV)
      return

    const container = document.createElement('div')
    document.body.appendChild(container)

    const panelApp = createApp({
      render: () => h(MockPanel),
    })
    panelApp.mount(container)
  },
}

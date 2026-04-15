import { delay } from 'msw'
import { ref } from 'vue'

export async function getMockTools() {
  const [{ worker }, { http }, { forbidden }] = await Promise.all([
    import('../browser'),
    import('msw'),
    import('../utils/forbidden'),
  ])
  return { worker, http, forbidden }
}

export function useMockScenario() {
  const active = ref(false)

  async function toggleStatusUpdateError() {
    if (!import.meta.env.DEV)
      return
    const { worker, http, forbidden } = await getMockTools()
    if (active.value) {
      worker.resetHandlers()
    }
    else {
      worker.use(
        http.patch('/api/submissions/:id/status', async () => {
          await delay(500)
          return forbidden()
        }),
      )
    }
    active.value = !active.value
  }

  return { active, toggleStatusUpdateError }
}

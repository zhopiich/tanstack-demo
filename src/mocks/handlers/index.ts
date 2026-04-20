import { delay, http } from 'msw'
import { authHandlers } from './auth'
import { dashboardHandlers } from './dashboard'
import { submissionHandlers } from './submissions'

const delayHandler = http.all('/api/*', async () => {
  await delay('real')
})

export const handlers = [
  delayHandler,
  ...authHandlers,
  ...submissionHandlers,
  ...dashboardHandlers,
]

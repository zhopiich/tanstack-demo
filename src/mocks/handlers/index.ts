import { authHandlers } from './auth'
import { dashboardHandlers } from './dashboard'
import { submissionHandlers } from './submissions'

export const handlers = [
  ...authHandlers,
  ...submissionHandlers,
  ...dashboardHandlers,
]

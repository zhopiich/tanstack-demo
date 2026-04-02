import { dashboardHandlers } from './dashboard'
import { submissionHandlers } from './submissions'

export const handlers = [
  ...submissionHandlers,
  ...dashboardHandlers,
]

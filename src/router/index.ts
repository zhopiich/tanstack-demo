import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAdmin?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'submissions' },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: () => import('@/features/submission/views/SubmissionsView'),
    },
    {
      path: '/submissions/new',
      name: 'submission-create',
      component: () => import('@/features/submission/views/SubmissionFormView/index.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/submissions/:id',
      name: 'submission-detail',
      component: () => import('@/features/submission/views/SubmissionDetailView/index.vue'),
    },
    {
      path: '/submissions/:id/edit',
      name: 'submission-edit',
      component: () => import('@/features/submission/views/SubmissionFormView/index.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/features/dashboard/views/DashboardView.vue'),
    },

  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if ((authStore.isAuthenticated && to.name === 'login')
    || (to.meta.requiresAdmin && authStore.role !== 'admin')) {
    return { name: 'submissions' }
  }
  if (!authStore.isAuthenticated && to.name !== 'login')
    return { name: 'login' }
})

export default router

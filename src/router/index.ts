import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      component: () => import('../views/SubmissionsView.vue'),
    },
    {
      path: '/submissions/new',
      name: 'submission-create',
      component: () => import('@/features/submission/views/SubmissionFormView.vue'),
    },
    {
      path: '/submissions/:id/edit',
      name: 'submission-edit',
      component: () => import('@/features/submission/views/SubmissionFormView.vue'),
    },

  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated && to.name === 'login') {
    return { name: 'home' }
  }
})

export default router

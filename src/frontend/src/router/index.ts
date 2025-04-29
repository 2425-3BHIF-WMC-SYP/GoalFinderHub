import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: '/games',
      name: 'games',
      component: () => import("@/views/GamesView.vue"),
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import("@/views/DevicesView.vue"),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import("@/views/SettingsView.vue"),
    },

    {
      path: '/createGame',
      name: 'createGame',
      component: () => import("@/views/StartGame.vue"),
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router

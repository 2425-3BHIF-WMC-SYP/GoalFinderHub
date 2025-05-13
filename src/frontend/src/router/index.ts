import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/user-store.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import("@/views/GamesView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import("@/views/TeamsView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import("@/views/DevicesView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/addDevice',
      name: 'addDevice',
      component: () => import("@/views/AddGoalfinder.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import("@/views/SettingsView.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: '/createGame',
      name: 'createGame',
      component: () => import("@/views/StartGame.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach(async (to, from) => {
  const user = useUserStore();

  if(user.isAuthenticated && to.name === 'login') {
    return "/";
  }

  if (!user.isAuthenticated && to.meta.requiresAuth) {
    return "/login";
  }
})

export default router

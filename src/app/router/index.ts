import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/catalog/ui/CatalogPage.vue'),
    },
    {
      path: '/product/:id',
      component: () => import('@/pages/product/ui/ProductPage.vue'),
    },
    {
      path: '/admin/login',
      component: () => import('@/pages/admin/login/ui/LoginPage.vue'),
    },
    {
      path: '/admin/products',
      component: () => import('@/pages/admin/products/ui/AdminProductsPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('access_token')) {
    return { path: '/admin/login' }
  }
})

export { router }

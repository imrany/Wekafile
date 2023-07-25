import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/delete/:filename',
      props:true,
      name: 'delete',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DeleteFileView.vue')
    },
    {
      path:"/storage",
      name:"storage",
      component:()=>import("../views/StorageView.vue")
    },
    {
      path:"/peers",
      name:"peers",
      component:()=>import("../views/PeersView.vue")
    },
    {
      path:"/guide",
      name:"guide",
      component:()=>import("../views/GuideView.vue")
    },
    {
      path:"/:pathMatch(.*)*",
      name:"404",
      component:()=>import("../views/NotFoundView.vue")
    }
  ]
})

export default router

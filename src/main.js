import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import BlogPost from './views/BlogPost.vue'
import './style.css'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/post/:slug',
    name: 'BlogPost',
    component: BlogPost,
    props: true
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: () => import('./views/Category.vue'),
    props: true
  },
  {
    path: '/tag/:tag',
    name: 'Tag',
    component: () => import('./views/Tag.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue';
import login from "../views/Login.vue";
import register from "../views/Register.vue";
import UserProfile from "../views/UserProfile.vue";
import cookies from "vue-cookies";


Vue.use(VueRouter)


const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },

  },
  {
    path:'/profile/:id',
    name: 'userProfile',
    component:UserProfile

  }
]

const router = new VueRouter({
  routes
  
})


router.beforeEach((to, from, next) => {
  
  const authenticatedUser = cookies.get('userId')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && ! authenticatedUser) next('login')
  else next();
})

export default router

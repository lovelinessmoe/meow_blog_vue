import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {path: '/', redirect: '/blog'},
    {path: '/blog', redirect: '/blog/home'},
    {
        path: '/blog/', component: () => import('@/views/BlogPage.vue'),
        children: [
            {path: 'home', component: () => import('@/views/Home.vue')},
            {path: 'classification', component: () => import('@/views/Classification.vue')},
            {path: 'about', component: () => import('@/views/About.vue')},
            {path: 'userInfo', component: () => import('@/views/UserInfo.vue')},
            {path: 'tags', component: () => import('@/views/Tags.vue')},
        ],
    },
    {path: '/login', component: () => import('@/components/Login.vue')},
    {path: '/logout', redirect: '/blog/home'},
    {path: '/backstage', component: () => import('@/views/Backstage')},

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 导航转成路由
export default router

import {createRouter, createWebHashHistory} from "vue-router";
import {getUserAuth} from "@/utils/token";
import {ElNotification} from 'element-plus'

const routes = [
    {path: '/', redirect: '/blog'},
    {path: '/blog', redirect: '/blog/home'},
    {
        path: '/blog/', component: () => import('@/views/BlogPage.vue'),
        children: [
            {path: '', redirect: '/blog/home'},
            {path: 'home', component: () => import('@/views/Home.vue')},
            {path: 'classification', component: () => import('@/views/Classification.vue')},
            {path: 'about', component: () => import('@/views/About.vue')},
            {path: 'userInfo', component: () => import('@/views/UserInfo.vue')},
            {path: 'tags', component: () => import('@/views/Tags.vue')},
            {path: 'view/:id', component: () => import('@/components/BlogView.vue')},
        ],
    },
    {path: '/login', component: () => import('@/components/Login.vue')},
    {path: '/logout', redirect: '/blog/home'},
    {
        path: '/backstage/', component: () => import('@/views/Backstage'),
        beforeEnter: () => {
            let userAuth = getUserAuth();
            if (userAuth === undefined || userAuth !== 'ROLE_ADMIN') {
                ElNotification({
                    message: '用户权限不足',
                    type: 'error'
                })
                return {path: '/'}
            }
        },
        children: [
            {path: '', redirect: '/backstage/home'},
            {path: 'home', component: () => import('@/views/Backstage/BackHomePage')},
            {path: 'userMan', component: () => import('@/views/Backstage/UserMan')},
            {path: 'articleMan', component: () => import('@/views/Backstage/ArticleMan')},
            // {path: 'addArticle', component: () => import('@/components/Backstage/ArticleEdit')},
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 导航转成路由
export default router

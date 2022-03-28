import {createRouter, createWebHashHistory} from "vue-router";
import {getUserAuth} from "@/utils/token";
import {ElNotification} from 'element-plus'

const routes = [
    {path: '/', redirect: '/blog'},
    {path: '/blog', redirect: '/blog/home'},
    {
        path: '/blog/', component: () => import('@/components/BlogPage.vue'),
        children: [
            {path: '', redirect: '/blog/home'},
            {path: 'home', component: () => import('@/components/Home.vue')},
            {path: 'classification', component: () => import('@/components/Classification.vue')},
            {path: 'about', component: () => import('@/components/About.vue')},
            {path: 'userInfo', component: () => import('@/components/UserInfo.vue')},
            {path: 'tags', component: () => import('@/components/Tags.vue')},
            {path: 'article/:id', component: () => import('@/components/Articles.vue')},
        ],
    },
    {path: '/login', component: () => import('@/components/Login.vue')},
    {path: '/logout', redirect: '/blog/home'},
    {
        path: '/backstage/', component: () => import('@/components/BlogPage.vue'),
        // path: '/backstage/', component: () => import('@/views/Backstage'),
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
            {path: 'home', component: () => import('@/components/Backstage/BackHomePage')},
            {path: 'userMan', component: () => import('@/components/Backstage/UserMan')},
            {path: 'articleMan', component: () => import('@/components/Backstage/ArticleMan')},
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

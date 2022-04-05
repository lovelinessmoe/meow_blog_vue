import {createRouter, createWebHashHistory} from "vue-router";
import {ElNotification} from 'element-plus'
import store from '@/store'

const routes = [
    {path: '/', redirect: '/blog'},
    {
        path: '/blog/', component: () => import('@/components/BlogPage.vue'),
        children: [
            {path: '', redirect: '/blog/home'},
            {path: 'home', component: () => import('@/components/Page/Home.vue'), meta: {title: '首页'}},
            {path: 'about', component: () => import('@/components/Page/About.vue'), meta: {title: '关于'}},
            {path: 'userInfo', component: () => import('@/components/Page/UserInfo.vue'), meta: {title: '用户信息'}},
            {path: 'tags', component: () => import('@/components/Tags.vue'), meta: {title: '标签'}},
            {
                path: 'article/:id',
                component: () => import('@/components/Page/Articles.vue'),
                meta: {title: '文章', params: 'id'}
            },
        ],
    },
    {path: '/login', component: () => import('@/components/Login.vue'), meta: {title: '登陆'}},
    {
        path: '/backstage/', component: () => import('@/components/BlogPage.vue'),
        beforeEnter: () => {
            // 如果store.state.user是undefined返回false，正常返回他的权限是否等于ROLE_ADMIN
            if (store.state.user ? false : store.state.user.authorities[0].authority === 'ROLE_ADMIN') {
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
            {path: 'userMan', component: () => import('@/components/Backstage/UserMan'), meta: {title: '用户管理'}},
            {path: 'articleMan', component: () => import('@/components/Backstage/ArticleMan'), meta: {title: '文章管理'}},
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    let title = 'MeowBlog'
    if (to.meta.params) {
        title = `${to.params[to.meta.params] || ''} - ${title}`
    } else {
        title = `${to.meta.title} - ${title}`
    }
    document.title = title
    if (to.path !== from.path) {
        store.commit('SET_LOADING', true);
    }
    next();
})
router.afterEach(() => {
    // 最多延迟 关闭 loading
    setTimeout(() => {
        store.commit('SET_LOADING', false);
    }, 1500)
})

// 导航转成路由
export default router

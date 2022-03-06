<template>
    <el-menu
            router="true"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-menu-item index="0" route="/blog/home">
            <img src="@/assets/img/logo.png" style="height: 58px;">
        </el-menu-item>
        <el-menu-item index="1" route="/blog/home">
            <el-icon>
                <home-filled/>
            </el-icon>
            <span>首页</span></el-menu-item>
        <el-menu-item index="2" route="/blog/classification">
            <el-icon>
                <grid/>
            </el-icon>
            <span>分类</span></el-menu-item>
        <el-menu-item index="3" route="/blog/tags">
            <el-icon>
                <collection-tag/>
            </el-icon>
            <span>标签</span></el-menu-item>
        <el-menu-item index="4" route="/blog/about">
            <el-icon>
                <avatar/>
            </el-icon>
            <span>关于</span></el-menu-item>
        <el-menu-item index="6" route="/backstage"
                      style="margin-left: auto;" v-if="Auth_show">
            <span>后台管理</span>
        </el-menu-item>
        <el-sub-menu index="5"
                     style="margin-left: auto;" v-if="User_show">
                        <template #title>你好, {{user.data.username}}</template>
<!--            <template #title>你好,</template>-->
            <el-menu-item index="5-1" route="/blog/userInfo">个人信息</el-menu-item>
            <el-menu-item index="5-2" route="/login">切换账号</el-menu-item>
            <el-menu-item index="5-3" route="/logout" @click="logout()">退出登陆
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="5"
                      style="margin-left: auto;" v-else
                      route="/login">
            <span>登陆/注册</span>
        </el-menu-item>
    </el-menu>

</template>

<script>
    import {getUser, getToken, removeToken, removeUser} from '@/utils/token'
    import {logout} from "@/api/login";

    export default {
        name: "TopBar",
        components: {},
        data() {
            return {Auth_show: false, User_show: false, user: getUser()}
        }, created() {
            this.Auth()
            this.Logined()
        },
        methods: {
            async Auth() {
                let user = getUser()
                console.dir(user)
                if (user === undefined || user.data.authorities[0].authority !== 'ROLE_ADMIN') {
                    this.Auth_show = false
                } else {
                    this.Auth_show = true
                }
            },
            async Logined() {
                let token = await getToken()
                if (token === undefined) {
                    this.User_show = false
                } else {
                    this.User_show = true
                }
            },
            async logout() {
                await logout()
                removeToken()
                removeUser()
                this.$router.go(0)
            }
        }
    }
</script>

<style scoped>

</style>

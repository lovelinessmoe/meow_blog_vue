<template>
    <!--<el-icon style="height: 40px">
        <d-arrow-left @click="changeTopBar()"/>
    </el-icon>-->
    <el-menu :collapse="isCollapse"
             router="true"
             style="height: 100%"
             class="el-menu-vertical-demo">
        <el-menu-item index="0" route="/blog/home">
            <img src="@/assets/img/logo.png" style="height: 58px;">
        </el-menu-item>
        <el-menu-item index="1" route="/backstage/home">
            <el-icon>
                <home-filled/>
            </el-icon>
            <span>首页</span></el-menu-item>
        <el-menu-item index="2" route="/backstage/userMan">
            <el-icon>
                <grid/>
            </el-icon>
            <span>用户管理</span></el-menu-item>
        <el-menu-item index="3" route="/backstage/articleMan">
            <el-icon>
                <collection-tag/>
            </el-icon>
            <span>文章管理</span></el-menu-item>
        <el-menu-item index="4" route="/backstage/tagMan" disabled>
            <el-icon>
                <avatar/>
            </el-icon>
            <span>标签管理(close)</span></el-menu-item>
        <!--<el-menu-item index="5" route="/backstage/addArticle">
            <el-icon>
                <avatar/>
            </el-icon>
            <span>添加文章</span></el-menu-item>-->
    </el-menu>
</template>

<script>
    export default {
        name: "BackTopBar",
        components: {},
        data() {
            return {
                isCollapse: false
            }
        },
        created() {

        },
        methods: {
            async changeTopBar() {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style scoped>

</style>

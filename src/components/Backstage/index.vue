<template>
        <el-container
                class="layout-container-demo"
                style="height: 100%; border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <BackTopBar></BackTopBar>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
</template>

<script>
    import BackTopBar from "@/components/Backstage/BackTopBar";

    export default {
        name: "BackIndex",
        components: {BackTopBar}
    }
</script>

<style scoped>

</style>

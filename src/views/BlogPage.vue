<template>
    <el-affix>
        <TopBar/>
    </el-affix>
    <router-view></router-view>
</template>

<script>
    import TopBar from "@/components/TopBar";

    export default {
        name: "BlogPage",
        components: {TopBar},
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>

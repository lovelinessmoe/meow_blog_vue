<template>
    <LoadingPage/>
    <TopBar/>
    <BlogPage/>
</template>

<script>
    import LoadingPage from "@/components/LoadingPage";
    import TopBar from "@/components/TopBar";
    import BlogPage from "@/components/BlogPage";

    export default {
        name: 'App',
        components: {BlogPage, TopBar, LoadingPage},
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style>
    #app {
        font-size: 17px;
        color: #6f6f6f;
    }

    html, body {
        margin: 0;
        padding: 0;
        min-height: calc(100vh - 80px);
    }


</style>

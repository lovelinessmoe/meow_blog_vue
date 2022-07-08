<template>
    <LoadingPage/>
    <TopBar/>
    <BlogPage/>
    <FooterView/>
    <meting-js
            fixed="true"
            id="7454455583"
            server="netease"
            type="playlist"
            volume="0.4">
    </meting-js>

    <!--    https://music.163.com/playlist?id=7454455583&userid=265622372-->
</template>

<script>
    import LoadingPage from "@/components/components/LoadingPage";
    import TopBar from "@/components/components/TopBar";
    import BlogPage from "@/components/BlogPage";
    import FooterView from "@/components/components/FooterView";

    export default {
        name: 'App',
        components: {FooterView, BlogPage, TopBar, LoadingPage},
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

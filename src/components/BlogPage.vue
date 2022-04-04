<template>
    <div id="layout-body">
        <router-view/>
        <back-top/>
    </div>
</template>

<script>

    import BackTop from "@/components/BackToTheTop";

    export default {
        name: "BlogPage",
        components: {BackTop},
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>
    #layout-body {
        /* header = 80px */
        min-height: -moz-calc(100vh - 80px);
        min-height: -webkit-calc(100vh - 80px);
        min-height: calc(100vh - 80px);
    }

</style>

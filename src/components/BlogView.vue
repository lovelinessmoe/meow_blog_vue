<template>
    <div>hahahahha</div>
    <div v-html="blog.articleContent" style="width: 60%;margin: 0 auto;"></div>
</template>

<script>
    import {getBlogDetail} from "@/api/article";

    export default {
        name: "BlogView",
        props: [],
        async created() {
            let res = await getBlogDetail(this.$route.params.id);
            this.blog = res.data;

        },
        data() {
            return {
                blog: {}
            }
        },
        methods: {},

    }
</script>

<style scoped>

</style>

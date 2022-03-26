<template>
    <div v-loading="isLoading">
        <el-space direction="vertical" :size="20" :fill="true"
                  style="width: 60%; margin: 0 auto">
            <div v-for="(blog,index) in page" :key="index" @click="goToBlog(blog)">
                <BlogCard v-bind:blog="blog"/>
            </div>

            <el-pagination
                    v-model:currentPage="current"
                    v-model:page-size="size"
                    :small="false"
                    :disabled="false"
                    :background="false"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    @current-change="currentChange"
                    default-page-size="10"
                    hide-on-single-page="true"/>
        </el-space>
    </div>
</template>

<script>
    import {getList} from "@/api/article";
    import BlogCard from "@/components/BlogCard";

    export default {
        name: "HomePage",
        components: {BlogCard},
        async created() {
            await this.getListPage();
        },
        data() {
            return {
                current: 1,
                size: 10,
                total: '',
                page: {},
                isLoading: true,
            }
        },
        methods: {
            async getListPage(current = 1, size = 10, params = undefined) {
                this.isLoading = true;
                let res = await getList(current, size, params);
                res = res.data;
                this.page = res.records;
                this.current = res.current;
                this.size = res.size;
                this.total = res.total;
                this.pages = res.pages;
                this.isLoading = false;
            },
            currentChange() {
                this.getListPage(this.current, this.size,);
            },
            goToBlog(blog) {
                this.$router.push("view/" + blog.articleId)
            },
        }
    }
</script>

<style scoped>

</style>

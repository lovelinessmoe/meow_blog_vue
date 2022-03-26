<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <!--<img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                 class="image"/>-->
            <div style="padding: 14px">
                <h2>{{ blog.articleTitle }}</h2>
                <span>{{ blog.articleShort }}</span>

                <div class="bottom">
                    <time class="time">
                        {{this.$moment(blog.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </time>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "BlogCard",
        props: ['blog'],
    }
</script>

<style scoped>

</style>

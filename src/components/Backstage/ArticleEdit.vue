<template>
    <el-form :model="formData" ref="vForm" :rules="rules" label-position="left" label-width="80px"
             size="default" @submit.prevent style="height: 100%">
        <el-card class="box-card" style="height: 100%" shadow="always" body-style="height: 100%">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="24" class="grid-cell">
                            <el-form-item label="以后想用来访问的地址" prop="" label-width="auto">
                                <el-input v-model="blogForm.articleId" type="text" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :md="12" :sm="12" :xs="24" class="grid-cell">
                            <el-form-item label="标题" prop="">
                                <el-input v-model="blogForm.articleTitle" type="text" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :sm="12" :xs="24" class="grid-cell">
                            <el-form-item label="简介" prop="">
                                <el-input v-model="blogForm.articleShort" type="text" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </template>

            <QuillEditor ref="myEditor"
                         style="height: 60%"
                         theme="snow"
                         :options="editorOption"
                         @ready="editReady(quill)"
            />
            <!--                         @update:content="onContentChange($event)"-->
            <!--                         contentType="html"-->
            <!--                         v-model:content="blogForm.articleContent"-->
            <!--            {{quill.getHTML()}}-->
            <el-button type="primary" @click="submitForm()">保存</el-button>
        </el-card>
    </el-form>
</template>

<script>
    import {QuillEditor} from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import {saveOrUpdateArticle, getDetail} from "@/api/Backstage/article";
    import {ElNotification} from 'element-plus'

    export default {
        name: "ArticleEdit",
        components: {QuillEditor},
        props: ['articleId'],
        created() {
        },
        data() {
            return {
                blogForm: {
                    articleContent: '',
                    articleId: '',
                    articleTitle: '',
                    articleShort: '',
                },
                editorOption: {
                    placeholder: '说些什么吧...',
                    modules: {
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline'], //加粗，斜体，下划线，删除线
                                ['code-block'], //引用，代码块
                                [{
                                    'header': 1
                                }, {
                                    'header': 2
                                }], // 标题，键值对的形式；1、2表示字体大小
                                [{
                                    'header': [1, 2, 3, 4, 5, 6, false]
                                }], //几级标题
                                [{
                                    'color': []
                                }, {
                                    'background': []
                                }], // 字体颜色，字体背景颜色
                                [{
                                    'align': []
                                }], //对齐方式
                                ['clean'], //清除字体样式
                                ['link', 'image', 'video'] //上传图片、上传视频
                            ],
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector(".quill-img input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                }
                            }
                        },
                    }
                },
            }
        },
        methods: {
            async editReady() {
                await this.getArticleDetail();
            },
            async submitForm() {
                this.blogForm.articleContent = this.$refs.myEditor.getHTML();
                const res = await saveOrUpdateArticle(this.blogForm)
                if (res.success) {
                    ElNotification({
                        message: '添加成功',
                        type: 'success'
                    })
                }
            },
            onContentChange(content) {
                this.blogForm.articleContent = content
            },
            async getArticleDetail() {
                if (this.articleId !== undefined) {
                    let res = await getDetail(this.articleId)
                    this.blogForm = res.data;
                    this.$refs.myEditor.setHTML(this.blogForm.articleContent)
                }
            },
        },
    }
</script>

<style scoped>
</style>

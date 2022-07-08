<template>
    <el-form @submit.prevent label-position="left"
             label-width="80px" size="default" style="height: 700px;">
        <el-card body-style="height: 100%" class="box-card" shadow="always" style="height: 100%">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="20" class="grid-cell">
                            <el-form-item label="以后想用来访问的地址" label-width="auto" prop="">
                                <el-input :disabled="articleTitleDisable" clearable type="text"
                                          v-model="blogForm.articleId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" class="grid-cell">
                            <el-button @click="uploadPicture('flagImg')" style="width: 100%;" type="primary">
                                <span>封面</span>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :md="12" :sm="12" :xs="24" class="grid-cell">
                            <el-form-item label="标题" prop="">
                                <el-input clearable type="text" v-model="blogForm.articleTitle"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :sm="12" :xs="24" class="grid-cell">
                            <el-form-item label="简介" prop="">
                                <el-input clearable type="text" v-model="blogForm.articleShort"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </template>

            <mavon-editor
                    :toolbars="markdownOption"
                    @save="submitForm()"
                    id="mavon_editor"
                    v-model="blogForm.articleContent"/>
            <!--                    ctrl + s 的回调事件(保存按键,同样触发该回调)-->

            <el-button @click="submitForm()" type="primary">保存</el-button>
            <el-button @click="this.$emit('close');" type="danger">取消</el-button>
        </el-card>
    </el-form>

    <!-- 剪裁组件弹窗 -->
    <el-dialog
            fullscreen="fullscreen"
            title="裁切封面"
            v-model="cropperModel">
        <cropper-image
                :fixedNumber="[16,9]"
                :url="blogForm.imgUrl?blogForm.imgUrl:''"
                @upload-img="handleUpload">
        </cropper-image>
    </el-dialog>

</template>

<script>
    import 'mavon-editor/dist/css/index.css'
    import {saveOrUpdateArticle, getDetail} from "@/api/Backstage/article";
    import {ElNotification} from 'element-plus'
    import CropperImage from "@/components/components/cropperImg/CropperImage";
    import useUpYun from '@/hooks/useUpYun'


    export default {
        name: "ArticleEdit",
        components: {CropperImage},
        props: ['articleId', 'articleTitleDisable'],
        emits: ['close'],
        created() {
        },
        mounted() {
            this.getArticleDetail();
        },
        data() {
            return {
                blogForm: {
                    articleContent: '',
                    articleId: '',
                    articleTitle: '',
                    articleShort: '',
                },
                // 配置参数
                markdownOption: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: true, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                },
                cropperModel: false,
            }
        },
        methods: {
            async submitForm() {
                const res = await saveOrUpdateArticle(this.blogForm)
                if (res.success) {
                    ElNotification({
                        message: '成功',
                        type: 'success'
                    })
                    this.$emit('close');
                }
            },
            async getArticleDetail() {
                if (this.articleId !== undefined) {
                    let res = await getDetail(this.articleId)
                    this.blogForm = res.data;
                }
            },
            //封面设置
            uploadPicture() {
                this.cropperModel = true;
            },
            //上传图片
            async handleUpload(data) {
                const {uploadArticleImg} = useUpYun();
                let res = await uploadArticleImg(data, this.blogForm.articleId);
                if (res.success) {
                    this.blogForm.imgUrl = res.data;
                    this.cropperModel = false;
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    #mavon_editor {
        z-index: 0;
        height: 500px;

    }


</style>

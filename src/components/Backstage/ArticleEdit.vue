<template>
    <el-form label-position="left" label-width="80px"
             size="default" @submit.prevent style="height: 100%">
        <el-card class="box-card" style="height: 100%" shadow="always" body-style="height: 100%">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="20" class="grid-cell">
                            <el-form-item label="以后想用来访问的地址" prop="" label-width="auto">
                                <el-input :disabled="articleTitleDisable" v-model="blogForm.articleId" type="text"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" class="grid-cell">
                            <el-button type="primary" @click="uploadPicture('flagImg')" style="width: 100%;">上传封面
                            </el-button>
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

            <!--<QuillEditor ref="myEditor"
                         :style="{'background-image': `url(${blogForm.imgUrl})`}"
                         style="background-repeat:no-repeat;background-size:contain;
                         background-position: right;height: 450px;"
                         theme="snow"
                         :modules="quillModules"
                         :options="editorOption"
                         @ready="editReady(quill)"/>-->

            <div class="in-editor-wrapper">
                <div id="editor"
                ></div>
                <!--:style="{'background-image': `url(${blogForm.imgUrl})`}"
                style="background-repeat:no-repeat;background-size:contain;
                    background-position: right;height: 450px;"-->
            </div>

            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button type="danger" @click="this.$emit('close');">取消</el-button>
        </el-card>
    </el-form>

    <!-- 剪裁组件弹窗 -->
    <el-dialog
            title="裁切封面"
            v-model="cropperModel"
            fullscreen="fullscreen">
        <cropper-image
                :fixedNumber="[16,9]"
                @upload-img-success="handleUploadSuccess">
        </cropper-image>
    </el-dialog>

</template>

<script>
    // 引入原始组件
    import Quill from 'quill'
    // 引入核心样式和主题样式
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import {saveOrUpdateArticle, getDetail} from "@/api/Backstage/article";
    import {ElNotification} from 'element-plus'
    import CropperImage from "@/components/Img/CropperImage";
    // import { ICON_SVGS } from 'components/in-editor/ui/icon'
    import QuillBetterTable from 'quill-better-table'
    import 'quill-better-table/dist/quill-better-table.css'

    Quill.register({
        'modules/better-table': QuillBetterTable
    }, true)

    export default {
        name: "ArticleEdit",
        components: {CropperImage},
        props: ['articleId', 'articleTitleDisable'],
        emits: ['close'],
        created() {
        },
        mounted() {
            // 初始化编辑器
            this.editor = new Quill('#editor', this.options);
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
                // 待初始化的编辑器
                editor: null,
                // 配置参数
                options: {
                    theme: 'snow',
                    modules: {
                        // 工具栏的具体配置
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                [{'script': 'super'}],
                                [{'indent': '-1'}, {'indent': '+1'}],
                                [{'size': ['small', false, 'large', 'huge']}],
                                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                                [{'color': []}, {'background': []}],
                                [{'align': []}],
                                ['link', 'image']
                            ],
                            handlers: {
                                'table': function () {
                                    console.log(this.quill)
                                    this.quill.getModule('better-table').insertTable(3, 3)
                                },
                            },
                        },
                        // 表格功能
                        table: false,
                        'better-table': {
                            operationMenu: {
                                items: {
                                    unmergeCells: {
                                        text: 'Another unmerge cells name'
                                    }
                                },
                                background: {
                                    color: '#333'
                                },
                                color: {
                                    colors: ['green', 'red', 'yellow', 'blue', 'white'],
                                    text: 'background:'
                                }
                            }
                        },
                        keyboard: {
                            bindings: QuillBetterTable.keyboardBindings
                        }
                    },
                    placeholder: '请输入内容 ...'
                },
                cropperModel: false,
            }
        },
        methods: {
            async submitForm() {
                // this.blogForm.articleContent = this.editor.container.innerHTML
                this.blogForm.articleContent = document.querySelector('#editor').children[0].innerHTML
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
                    // 将数据库传入的HTML内容转换成编辑器识别的delta对象
                    let delta = this.editor.clipboard.convert({html: this.blogForm.articleContent})

                    // 编辑器的内容需要接收delta对象
                    this.editor.setContents(delta)
                }
            },
            //封面设置
            uploadPicture() {
                this.cropperModel = true;
            },
            //图片上传成功后
            handleUploadSuccess(data) {
                this.blogForm.imgUrl = 'http://oss.javaee.xyz/' + data.key;
                this.cropperModel = false;
            }
        },

    }
</script>

<style scoped>

</style>

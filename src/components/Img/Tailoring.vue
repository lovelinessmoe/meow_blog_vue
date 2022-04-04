<template>
    <div class="cropper-app">
        <el-form :model="formValidate" :rules="ruleValidate" ref="formValidate" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="封面上传" prop="mainImage">
                <div class="list-img-box">
                    <div v-if="formValidate.mainImage !== ''">
                        <img :src="formValidate.mainImage" style='width:300px;height:150px' alt="自定义封面">
                    </div>
                    <div v-else class="upload-btn" style="height: 120px;" @click="uploadPicture('flagImg')">
                        <i class="el-icon-plus" style="font-size: 30px;"></i>
                        <span>封面设置</span>
                    </div>
                </div>
                <input type="hidden" v-model="formValidate.mainImage" placeholder="请添加封面">
            </el-form-item>
        </el-form>
        <!-- 剪裁组件弹窗 -->
        <el-dialog
                title="裁切封面"
                v-model="cropperModel"
                width="950px"
                center>
            <cropper-image
                    :fixedNumber="[16,9]"
                    @uploadImgSuccess="handleUploadSuccess">
            </cropper-image>
        </el-dialog>
        <!--查看大封面-->
        <el-dialog
                title="查看大封面"
                v-model="imgVisible"
                center>
            <img :src="imgName" v-if="imgVisible" style="width: 100%" alt="查看">
        </el-dialog>
    </div>
</template>

<script>
    import CropperImage from "@/components/Img/CropperImage";
    import {ElNotification} from 'element-plus'

    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "Tailoring",
        components: {CropperImage},
        data() {
            return {
                formValidate: {
                    mainImage: '',
                },
                ruleValidate: {
                    mainImage: [
                        {required: true, message: '请上传封面', trigger: 'blur'}
                    ],
                },
                //裁切图片参数
                cropperModel: false,
                cropperName: '',
                imgName: '',
                imgVisible: false
            }
        },
        methods: {
            //封面设置
            uploadPicture(name) {
                this.cropperName = name;
                this.cropperModel = true;

            },
            //图片上传成功后
            handleUploadSuccess(data) {
                console.log(data)
                switch (data.name) {
                    case 'flagImg':
                        this.formValidate.mainImage = 'http://oss.javaee.xyz/' + data.key;
                        console.log('最终输出' + data.key)
                        this.imgVisible = false;
                        ElNotification({
                            message: '上传成功',
                            type: 'success'
                        })
                        break;
                }
                this.cropperModel = false;
            }
        }
    }
</script>
<style scoped>
    .upload-list-cover {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 40px;
        align-items: center;
        background: rgba(0, 0, 0, .6);
        opacity: 0;
        transition: opacity 1s;
    }

    .cover_icon {
        font-size: 30px;
    }

    .upload-btn {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        border: 1px solid #cccccc;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 1px #cccccc;
    }

    .upload-btn:hover {
        border: 1px solid #69b7ed;
    }

    .upload-btn i {
        margin: 5px;
    }
</style>

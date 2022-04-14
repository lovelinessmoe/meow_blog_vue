<template>
    <div class="user-info">
        <div class="site-content">
            <div class="content-warp">
                <el-form label-position="left" label-width="80px"
                         size="default" @submit.prevent style="height: 100%">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <div style="">
                                    <span>个人资料修改</span>
                                    <el-button type="success" icon="Check" circle @click="userCheckModel = true;"
                                               style="float:right;"/>
                                    <div style="clear:both;"></div>
                                </div>
                            </div>
                        </template>
                        <div>
                            <el-row>
                                <el-col :xs="24" :sm="10" :md="8" class="grid-cell">
                                    <el-avatar shape="square" :size="200" :src="user.avatarUrl"
                                               @click="cropperModel=true"
                                               fit="fill"/>
                                </el-col>
                                <el-col :xs="24" :sm="14" :md="16" class="grid-cell">
                                    <el-form-item label="昵称" prop="">
                                        <el-input v-model="user.userName" type="text" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="年龄" prop="">
                                        <el-input v-model="user.age" type="number" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号" prop="">
                                        <el-input v-model="user.telephone" type="text" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="">
                                        <el-input type="password" v-model="user.password" placeholder="留空表示不修改"
                                                  clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-form>
            </div>
        </div>
    </div>

    <!-- 剪裁组件弹窗 -->
    <el-dialog
            title="裁切封面"
            v-model="cropperModel"
            fullscreen="fullscreen">
        <cropper-image
                :url="user.avatarUrl?user.avatarUrl:''"
                :fixedNumber="[1,1]"
                @upload-img-success="handleUploadSuccess">
        </cropper-image>
    </el-dialog>

    <el-dialog
            title="身份验证"
            v-model="userCheckModel"
            width="300px">
        <el-row>
            <el-col class="grid-cell">
                <el-input v-model="captchaVal.verifyCode" placeholder="请输入验证码"
                          prefix-icon="Grid" class="verifyCode"></el-input>
                <img v-bind:src="captchaVal.captchaImg" class="verifyCode_img" @click="getCaptcha" alt="你瞅啥">
            </el-col>
        </el-row>
        <el-row>
            <el-col class="grid-cell">
                <el-input v-model="mailCode" placeholder="请输入邮箱验证码"
                          prefix-icon="Watermelon" class="mailCode"></el-input>
                <el-button type="primary" class="email_button" @click="getEmailCode"
                           :disabled="!captchaVal.verifyCode">获取邮箱验证码
                </el-button>
            </el-col>
        </el-row>
        <el-button type="primary" @click="updateUserInfo"
                   :disabled="!mailCode">
            确定
        </el-button>
    </el-dialog>

</template>

<script setup>
    import {getModifyInfMail, getUserInfo, updateUserInfoApi} from "@/api/user";
    import {ref, onBeforeMount} from "vue";
    import CropperImage from "@/components/components/cropperImg/CropperImage";
    import authCheck from '@/hooks/useCaptcha'
    import {ElNotification} from "element-plus";

    const {getCaptcha, captchaVal} = authCheck()

    getCaptcha();

    //获取用户信息
    let user = ref([]);
    onBeforeMount(async () => {
        const res = await getUserInfo();
        user.value = res.data;
    });
    let userCheckModel = ref(false);

    //图片上传
    let cropperModel = ref(false);

    //图片上传成功后
    function handleUploadSuccess(data) {
        this.blogForm.imgUrl = 'http://oss.javaee.xyz/' + data.key;
        this.cropperModel = false;
    }

    //邮箱
    let mailCode = ref('');

    async function getEmailCode() {
        console.log(captchaVal.verifyCode)
        if (captchaVal.verifyCode === '') {
            ElNotification({
                message: '请输入验证码',
                type: 'error'
            })
            return false;
        }

        let res = await getModifyInfMail(captchaVal);
        if (res.success) {
            ElNotification({
                message: '发送成功',
                type: 'success'
            })
        } else {
            //重新获取验证码
            await getCaptcha()
        }
    }


    //提交修改用户信息
    async function updateUserInfo() {
        let res = await updateUserInfoApi(user.value, mailCode.value);
        if (res.success) {
            userCheckModel.value = false;
        }
    }

</script>

<style scoped lang="less">
    .user-info {
        padding-top: 40px;
    }

    .content-warp {
        margin-top: 80px;

        .box-card {
            width: 100%;
        }
    }

    /*******/
    @media (max-width: 800px) {
        .content-warp {
            margin-top: 0;
        }
    }


    .verifyCode {
        width: 50%;
        justify-content: left;
    }

    .verifyCode_img {
        width: 50%;
        height: 30px;
        justify-content: flex-end;
    }

    .mailCode {
        width: 50%;
        justify-content: left;
    }

    .email_button {
        width: 50%;
        height: 30px;
        justify-content: flex-end;
    }

</style>

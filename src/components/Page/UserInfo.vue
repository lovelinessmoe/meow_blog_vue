<template>
    <div class="user-info">
        <div class="site-content">
            <div class="content-warp">
                <el-form @submit.prevent label-position="left"
                         label-width="80px" size="default" style="height: 100%">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <div style="">
                                    <span>个人资料修改</span>
                                    <el-button @click="userCheckModel = true;" circle icon="Check" style="float:right;"
                                               type="success"/>
                                    <div style="clear:both;"></div>
                                </div>
                            </div>
                        </template>
                        <div>
                            <el-row>
                                <el-col :md="8" :sm="10" :xs="24" class="grid-cell">
                                    <el-avatar :size="200" :src="user.avatarUrl" @click="cropperModel=true"
                                               fit="fill"
                                               shape="square"/>
                                </el-col>
                                <el-col :md="16" :sm="14" :xs="24" class="grid-cell">
                                    <el-form-item label="昵称" prop="">
                                        <el-input clearable type="text" v-model="user.userName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="年龄" prop="">
                                        <el-input clearable type="number" v-model="user.age"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号" prop="">
                                        <el-input clearable type="text" v-model="user.telephone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="">
                                        <el-input clearable placeholder="留空表示不修改" type="password"
                                                  v-model="user.password"></el-input>
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
            fullscreen="fullscreen"
            title="裁切封面"
            v-model="cropperModel">
        <cropper-image
                :fixedNumber="[1,1]"
                :url="user.avatarUrl?user.avatarUrl:''"
                @upload-img="handleUpload">
        </cropper-image>
    </el-dialog>

    <el-dialog
            title="身份验证"
            v-model="userCheckModel"
            width="300px">
        <el-row>
            <el-col class="grid-cell">
                <el-input class="verifyCode" placeholder="请输入验证码"
                          prefix-icon="Grid" v-model="captchaVal.verifyCode"></el-input>
                <img @click="getCaptcha" alt="你瞅啥" class="verifyCode_img" v-bind:src="captchaVal.captchaImg">
            </el-col>
        </el-row>
        <el-row>
            <el-col class="grid-cell">
                <el-input class="mailCode" placeholder="请输入邮箱验证码"
                          prefix-icon="Watermelon" v-model="mailCode"></el-input>
                <el-button :disabled="!captchaVal.verifyCode" @click="getEmailCode" class="email_button"
                           type="primary">获取邮箱验证码
                </el-button>
            </el-col>
        </el-row>
        <el-button :disabled="!mailCode" @click="updateUserInfo"
                   type="primary">
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
    import {logout} from "@/api/login";
    import {removeUser} from "@/utils/token";
    import router from '@/router'
    import useUpYun from '@/hooks/useUpYun'


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

    const {uploadAvatarImg} = useUpYun();

    //图片上传
    async function handleUpload(data) {
        let res = await uploadAvatarImg(data);
        if (res.success) {
            user.value.avatarUrl = res.data;
            cropperModel.value = false;
        }
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
            ElNotification({
                message: '修改成功，请重新登陆',
                type: 'success'
            })
            userCheckModel.value = false;
            await logout();
            await removeUser();
            await router.push('/login')
        }
    }
</script>

<style lang="less" scoped>
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

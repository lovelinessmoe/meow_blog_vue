<!--登陆-->
<template>
    <!--登录表单的容器-->
    <div class="login_container"
         style="background-image: url('https://s2.loli.net/2022/04/03/NxQafWFpP5YkTm3.jpg');
                background-repeat: no-repeat;background-size: cover">
        <!--登录区域-->
        <div class="login_box">
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login_form">

                <el-form-item prop="username">
                    <el-input v-model="loginForm.userName" placeholder="请输入用户名称"
                              prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入登录密码"
                              prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item prop="password" v-if="type === 'register'">
                    <el-input v-model="loginForm.RePassword" placeholder="请重复输入一次登录密码"
                              prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item prop="email" v-if="type === 'register'">
                    <el-input v-model="loginForm.email" placeholder="请输入邮箱"
                              prefix-icon="Message"></el-input>
                </el-form-item>
                <el-form-item prop="age" v-if="type === 'register'">
                    <el-input v-model="loginForm.age" placeholder="请输入年龄"
                              prefix-icon="Coin"></el-input>
                </el-form-item>
                <el-form-item prop="telephone" v-if="type === 'register'">
                    <el-input v-model="loginForm.telephone" placeholder="请输入手机号"
                              prefix-icon="Cellphone"></el-input>
                </el-form-item>
                <el-form-item prop="verifyCode">
                    <div class="verifyCode_box">
                        <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码"
                                  prefix-icon="Grid"
                                  class="verifyCode" ref="verifyCode"></el-input>
                        <img v-bind:src="captchaImg" class="verifyCode_img" @click="captcha">
                    </div>
                </el-form-item>
                <el-form-item class="login_btn">
                    <el-button v-if="type === 'register'" type="primary" @click="submitForm('loginForm')">注册</el-button>
                    <el-button v-else type="primary" @click="submitForm('loginForm')">登陆</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                    <el-button v-if="type === 'register'" @click="type = 'login'">返回登陆</el-button>
                    <el-button v-else @click="type = 'register'">去注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login, captcha, register} from '@/api/login'
    import {ElNotification} from 'element-plus'
    import {setUser} from "@/utils/token";

    export default {
        name: "LoginComponent",
        data() {
            return {
                type: "login",
                loginForm: {
                    userName: '',
                    password: '',
                    email: '',
                    age: '',
                    telephone: '',
                    verifyCode: '',
                    captchaVerification: '',
                    RePassword: ''
                },
                captchaImg: null,
                loginRules: {
                    userName: [{
                        required: true,
                        message: '请输入用户名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 16,
                        message: '长度在 3 到 16 个字符',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入登录密码',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 16,
                        message: '长度在 3 到 16 个字符',
                        trigger: 'blur'
                    }],
                    RePassword: [{
                        required: true,
                        message: '请重复输入一次登录密码',
                        trigger: 'blur'
                    }],
                    verifyCode: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }],
                    email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }]
                },
            }
        },
        created() {
            this.captcha()
        },
        methods: {
            async submitForm() {
                if (this.type === 'login') {
                    const res = await login(this.loginForm)
                    if (res.success) {
                        setUser(res.data);
                        ElNotification({
                            message: '登陆成功',
                            type: 'success'
                        });
                        await this.$router.push('/blog/home');
                    }
                } else {
                    if (this.loginForm.RePassword !== this.loginForm.password) {
                        ElNotification({
                            message: '两次输入的密码不相同',
                            type: 'error'
                        })
                        return false;
                    }
                    const res = await register(this.loginForm)
                    if (res.success) {
                        ElNotification({
                            message: '注册成功，快去登陆吧',
                            type: 'success'
                        })
                        //重新获取验证码
                        await this.captcha()
                        //验证码获得焦点
                        this.$refs.verifyCode.$el.querySelector('input').focus()
                        this.type = 'login'
                    } else {
                        //重新获取验证码
                        await this.captcha()
                        //验证码获得焦点
                        this.$refs.verifyCode.$el.querySelector('input').focus()
                    }
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
            async captcha() {
                let captchaRes = await captcha()
                this.captchaImg = captchaRes.data.img
                this.loginForm.captchaVerification = captchaRes.data.captchaVerification
                this.loginForm.verifyCode = ''
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 80px;
        min-height: calc(100vh - 80px);
    }

    .login_box {
        border: 1px solid red;
        margin: 0 auto;
        padding: 20px;
        background-color: whitesmoke;
        width: 300px;
        border-radius: 18px;

        .login_form {
            width: 100%;

            .login_btn {
                display: flex;
                justify-content: flex-end;
            }

            .verifyCode_box {
                width: 100%;
                display: flex;

                .verifyCode {
                    width: 50%;
                    justify-content: left;
                }

                .verifyCode_img {
                    width: 50%;
                    height: 30px;
                    justify-content: flex-end;
                }
            }
        }
    }
</style>

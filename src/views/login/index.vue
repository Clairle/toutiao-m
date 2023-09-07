<template>
    <div class="login-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" title="登录">
            <van-icon 
            slot="left" 
            name="cross" 
            @click="$router.back()"
            />
        </van-nav-bar>

        <!-- 登录表单 -->
        <van-form @submit="onSubmit"  ref="loginForm">
            <van-field
                v-model="user.mobile"
                name="mobile"
                placeholder="请输入手机号"
                :rules="userFormRules.mobile"
                type="number"
                maxlength="11"  
            >
                <i slot="left-icon" class="toutiao toutiao-shouji"></i>
            </van-field>

            <van-field
                v-model="user.code"
                name="code"
                placeholder="请输入验证码"
                :rules="userFormRules.code"
                type="number"
                maxlength="6"
            >
                <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
                <!-- 倒计时组件 -->
                <van-count-down
                    v-if="isCountDownShow"
                    slot="button"
                    :time="1000 * 5"
                    format="ss s"
                    @finish="isCountDownShow = false"
                />
                <template #button>
                    <!-- 倒计时组件 -->
                    <van-count-down
                        v-if="isCountDownShow"
                        slot="button"
                        :time="1000 * 5"
                        format="ss s"
                        @finish="isCountDownShow = false"
                    />
                    <van-button v-else class="send-sms-btn" 
                    round size="small" type="default" 
                    @click="onSendSms">发送验证码</van-button>
                </template>
            </van-field>

            <div class="login-btn-wrap">
                <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
            </div>
        </van-form>
    </div>
</template>
  
<script>
import { login, getSmsCode } from '@/api/user'
export default {
    name: 'LoginPage',
    components: {},
    props: {},
    data () {
        return {
            user: {
                mobile: '13911111111',
                code: '246810'
            },
            // 表单校验对象
            userFormRules: {
                mobile: [{
                    required: true,
                    message: '手机号不能为空'
                },
                {
                    pattern: /^1[3|5|7|8]\d{9}$/,
                    message: '手机号格式错误'
                }],
                code: [{
                    required: true,
                    message: '验证码不能为空'
                },
                {
                    pattern: /^\d{6}$/,
                    message: '验证码格式错误'
                }
            ]
            },
            // 控制倒计时的显示和隐藏
            isCountDownShow: false
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        // 表单登录功能
        async onSubmit () {
            // 1.获取表单数据
            const user = this.user
            // 2.表单验证
            this.$toast.loading({
                duration: 0, // 持续展示 toast
                message: "登录中...",
                forbidClick: true // 是否禁止背景点击
            });
            // 3.提交表单请求登录
            try {
                const {data} = await login(this.user)
                this.$store.commit('setUser', data.data)
                this.$toast.success('登录成功')

                // 登录成功跳转回原页面
                this.$router.back()
            } catch (err) {
                if (err.response.status === 400) {
                    this.$toast.fail('登录失败，手机号或验证码错误')
                }
                else{
                    this.$toast.fail('登录失败，请稍后重试')
                }
            }
            // 4.后续其它操作
        },
        // 验证码处理功能
        async onSendSms () {
            // 校验手机号
            try {
                // ref 可以获取到 Form 实例验证表单，传入 name 来验证手机号
                await this.$refs.loginForm.validate('mobile') 
            } catch (err) {
                return console.log('验证失败', err)
            }
            // 通过校验，开始倒计时
            this.isCountDownShow = true
            // 发送验证码
            try {
                await getSmsCode(this.user.mobile)
                this.$toast('发送成功')
            } catch (err) {
                // 发送失败，关闭倒计时
                this.isCountDownShow = false
                if (err.response.status === 429) {
                    this.$toast('发送太频繁了，请稍后重试')
                } else {
                    this.$toast('发送失败，请稍后重试')
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
.login-container {
    .toutiao {
        font-size: 37px
    }
    .send-sms-btn {
        width: 200px;
        height: 46px;
        line-height: 46px;
        background-color: #ededed;
        font-size: 22px;
        color: #666;
    }
    .login-btn-wrap {
        padding: 53px 33px;
        .login-btn {
            background-color: #6db4fb;
            border: none;
        }
    }
}
</style>
  
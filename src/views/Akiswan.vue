<style>
  .el-dialog.swan-dialog {
    border-radius: 20px;
    border-width: 10px;
    border-style: solid;
    border-color: #FFE202;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #707070;
    font-weight: bold;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .geetest_holder.geetest_wind {
    min-width: 200px;
  }
</style>
<template>
  <div class="swan">
    <el-container>
      <el-header style="padding: 0" height="70px">
        <div>
          <div class="swan-title"><b>天鹅肉</b></div>
          <div class="swan-sign">
            <div v-if="visibleSignBt">
              <el-button type="text" @click.native="signin()">Log in</el-button>
              <span> | </span>
              <el-button type="text" @click.native="signup()">Sign up</el-button>
            </div>
            <div v-else>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{this.nickName}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">登出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <div class="swan-tabs">
          <el-tabs v-model="activeName" :before-leave="beforeLeave">
            <el-tab-pane label="烤箱" name="oven">
              <oven :activeName="activeName"></oven>
            </el-tab-pane>
            <el-tab-pane label="橱窗" name="window">
              <window :activeName="activeName"></window>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
    <div>
      <!--登陆-->
      <el-dialog title="Log in" custom-class="swan-dialog"
                 :visible.sync="visibleSignIn"
                 :modal="false"
                 top="200px"
                 :destroy-on-close="true"
      >
        <el-form :model="inForm" :rules="inRules" ref="inForm" class="swan-input">
          <el-form-item label="Name" prop="username">
            <el-input v-model="inForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="inForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="capBox">
              <div id="captchaBox" style="min-width: 200px"></div>
            </div>
            <!--            <p id="wait" class="show">正在加载验证码....</p>-->
          </el-form-item>
          <el-form-item class="submit-bt">
            <span class="login-bt">
              <el-button type="primary" @click="submitInForm('inForm')">Log in</el-button>
            </span>
            <span>  | </span>
            <span class="signup-bt">
            <el-button type="text" @click.native="signup()">Sign up</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--注册-->
    <el-dialog title="Sign up" :visible.sync="visibleSignUp" custom-class="swan-dialog"
               top="200px"
               :modal="false"
               :destroy-on-close="true"
    >
      <el-form :model="upForm" :rules="upRules" ref="upForm" class="swan-input">
        <el-form-item label="Name" prop="username">
          <el-input v-model="upForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="upForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="upForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="checkpass">
          <el-input type="password" v-model="upForm.checkpass"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone" class="upFormPhone">
          <el-input v-model="upForm.phone" size="medium "></el-input>
          <el-input v-model="upForm.code" size="medium" placeholder="验证码" style="width: 40%"></el-input>
          <span class="Captcha-bt">
            <el-button type="primary" @click="sentCaptcha" :disabled="!capButtonShow">
              <span v-show="capButtonShow">验证码</span>
              <span v-show="!capButtonShow">{{count}} s</span>
            </el-button>
          </span>
        </el-form-item>
        <el-form-item class="submit-bt">
            <span class="create-bt">
              <el-button type="primary" @click="submitupForm('upForm')">Create Account</el-button>
            </span>
          <span>  | </span>
          <span class="signup-bt">
            <el-button type="text" @click.native="signin()">Log in</el-button>
            </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Oven from './oven'
import Window from './window'
import '../assets/js/gt.js'
import { isvalidPhone } from '../assets/js/validate.js'

export default {
  name: 'Akiswan',
  components: { Window, Oven },
  data () {
    const validateNickName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else {
        callback()
      }
    }
    const validatePassReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.upForm.password.length < 6) {
          callback(new Error('密码最小长度6位'))
        }
        if (this.upForm.password.length > 32) {
          callback(new Error('密码最大长度32位'))
        }
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassReg2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.upForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      inForm: {
        username: '',
        password: ''
      },
      upForm: {
        username: '',
        nickname: '',
        password: '',
        checkpass: '',
        phone: '',
        code: ''
      },
      upRules: {
        username: [
          { validator: validateName, trigger: 'blur' }
        ],
        nickname: [
          { validator: validateNickName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassReg, trigger: 'blur' }
        ],
        checkpass: [
          { validator: validatePassReg2, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      inRules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
      ipForm: {
        username: '',
        password: '',
        Nickname: '',
        phone: ''
      },
      visibleSignIn: false,
      visibleSignUp: false,
      visibleSignBt: true,
      activeName: 'window',
      nickName: '',
      validResult: [],
      validRegResult: [],
      geetestStatus: false,
      // 验证码按钮
      capButtonShow: true,
      count: '',
      timber: null
    }
  },
  methods: {
    beforeLeave (activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
      if (activeName === 'oven') {
        if (!window.sessionStorage.getItem('token')) {
          this.$notify({
            title: '',
            message: '请先登录哦',
            type: 'warning'
          })
          return false
        }
      }
    },
    handleCommand (command) {
      if (command === 'a') {
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('nickname')
        this.visibleSignBt = true
      }
    },
    submitInForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          console.log(this.validResult)
          if (this.validResult.length !== 0) {
            // this.axiosValidate('login')
            this.goLogin()
          } else {
            return alert('请完成验证')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitupForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          console.log(this.validRegResult)
          if (this.validRegResult.length !== 0) {
            // this.axiosValidate('create')
            this.goSignup()
          } else {
            return alert('请完成验证')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getGeetestReg () {
      this.axios.get('base/geetest/getcaptcha').then(res => {
        const data = res.data
        // eslint-disable-next-line no-undef
        initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind',
          width: '200px'
        },
        (captchaObj) => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          // captchaObj.appendTo('#captchaPhoneBox')
          captchaObj.onReady(() => {
            captchaObj.verify()
          }).onSuccess(() => {
            this.validRegResult = captchaObj.getValidate()
            console.log(this.validRegResult)
            // this.axiosValidate('create')
            this.registerCaptchaPhone()
          }).onError(() => {
          })
        })
      })
        .catch(error => {
          console.log(
            error
          )
        })
    },
    getGeetest () {
      this.axios.get('base/geetest/getcaptcha').then(res => {
        const data = res.data
        // eslint-disable-next-line no-undef
        initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'float',
          width: '100px'
        },
        (captchaObj) => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.appendTo('#captchaBox')
          captchaObj.onReady(() => {

          }).onSuccess(() => {
            this.validResult = captchaObj.getValidate()
            // console.log(this)
          }).onError(() => {
            // your code
          })
        })
      })
        .catch(error => {
          console.log(
            error
          )
        })
    },
    axiosValidate (type) {
      // eslint-disable-next-line no-undef
      if (type === 'login') {
        this.goLogin()
      } else if (type === 'create') {
        this.registerCaptchaPhone()
      }
    },
    goSignup () {
      console.log(this.upForm)
      this.axios.post('user/', this.upForm).then((response) => {
        console.log(response)
        if (response.data.msg === 'OK') {
          this.$notify({
            title: '成功',
            message: '注册成功',
            type: 'success'
          })
          this.signin()
        } else {
          this.$notify({
            title: '错误',
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    goLogin () {
      console.log(this.inForm)
      const param = {
        geetest_challenge: this.validResult.geetest_challenge,
        geetest_seccode: this.validResult.geetest_seccode,
        geetest_validate: this.validResult.geetest_validate,
        username: this.inForm.username,
        password: this.inForm.password
      }
      console.log(param)
      this.axios.post('user/token', param).then((response) => {
        console.log(response)
        if (response.data.msg === 'OK') {
          this.$notify({
            title: '成功',
            message: '登陆成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', response.data.body.token)
          // window.sessionStorage.setItem('nickname', response.data.body.token)
          this.nickName = response.data.body.user.nickname
          window.sessionStorage.setItem('nickname', response.data.body.user.nickname)
          this.checkToken()
          this.visibleSignIn = !this.visibleSignIn
        } else {
          if (response.data.identifier === 'PASSWORD') {
            this.$notify.error({
              title: '错误',
              // message: response.data.msg
              message: '密码错误,请重试'
            })
          } else if (response.data.identifier === 'GEETEST_VALIDATE') {
            this.$notify.error({
              title: '错误',
              // message: response.data.msg
              message: '极验验证错误，请稍后再试'
            })
          } else {
            this.$notify.error({
              title: '错误',
              // message: response.data.msg
              message: '账户不存在,请重试'
            })
          }
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    registerCaptchaPhone () {
      // eslint-disable-next-line no-unused-vars
      const phoneReg = {
        geetest_challenge: this.validRegResult.geetest_challenge,
        geetest_seccode: this.validRegResult.geetest_seccode,
        geetest_validate: this.validRegResult.geetest_validate,
        phone: this.upForm.phone
      }
      this.axios.post('user/registerCaptcha', phoneReg).then((res) => {
        console.log(res)
        if (res.data.body.send) {
          this.$notify.success({
            title: 'yes！',
            message: res.data.body.toast_msg
          })
          const TIME_COUNT = 60 // 更改倒计时时间
          if (!this.timer) {
            this.count = TIME_COUNT
            this.capButtonShow = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.capButtonShow = true
                clearInterval(this.timer) // 清除定时器
                this.timer = null
              }
            }, 1000)
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.body.toast_msg
          })
        }
      })
    },
    sentCaptcha () {
      this.$refs.upForm.validateField('phone', (valid) => {
        if (!valid) {
          this.getGeetestReg()
        } else {
          return false
        }
      })
    },
    signin () {
      this.visibleSignUp = this.visibleSignIn
      this.visibleSignIn = !this.visibleSignIn
      this.geetestStatus = false
      this.getGeetest()
    },
    signup () {
      this.visibleSignIn = this.visibleSignUp
      this.visibleSignUp = !this.visibleSignUp
    },
    checkToken () {
      // console.log(window.sessionStorage.getItem('token'))
      if (window.sessionStorage.getItem('token')) {
        this.visibleSignBt = false
        this.nickName = window.sessionStorage.getItem('nickname')
      } else {
        this.visibleSignBt = true
      }
    }

  },
  mounted () {
    this.checkToken()
  },
  created () {

  }
}
</script>

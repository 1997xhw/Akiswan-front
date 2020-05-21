<style>
  .el-dialog.swan-dialog {
    border-radius: 20px;
    border-width: 10px;
    border-style: solid;
    border-color: #FFE202;
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
              <el-button type="text" @click.native="signin()">Login</el-button>
              <span> | </span>
              <el-button type="text" @click.native="signup()">Sign up</el-button>
            </div>
            <div v-else>
              <span>{{this.nickName}}</span>
            </div>

          </div>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <div class="swan-tabs">
          <el-tabs v-model="activeName">
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
      <el-dialog title="Login" custom-class="swan-dialog"
                 :visible.sync="visibleSignIn"
                 width="50%" :modal="false"
                 top="200px"
      >
        <el-form :model="inForm" :rules="inRules" ref="inForm" class="swan-input">
          <el-form-item label="Username" prop="username">
            <el-input  v-model="inForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="inForm.password"></el-input>
          </el-form-item>
          <el-form-item class="submit-bt">
            <span class="login-bt">
              <el-button type="primary" @click="submitInForm('inForm')">Login</el-button>
            </span>
            <span>  | </span>
            <span class="signup-bt">
            <el-button type="text" @click.native="signup()">Sign up</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-dialog title="注册" :visible.sync="visibleSignUp" custom-class="swan-dialog"
               top="200px"
               width="50%" :modal="false"
    >
    </el-dialog>
  </div>
</template>

<script>
import Oven from './oven'
import Window from './window'

export default {
  name: 'Akiswan',
  components: { Window, Oven },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        // if (this.inForm.password.length < 6) {
        //   callback(new Error('密码最小长度6位'))
        // }
        // if (this.inForm.password.length > 32) {
        //   callback(new Error('密码最大长度32位'))
        // }
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        // if (this.inForm.password.length < 3) {
        //   callback(new Error('密码最小长度3位'))
        // }
        // if (this.inForm.password.length > 32) {
        //   callback(new Error('密码最大长度32位'))
        // }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
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
      inRules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
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
      nickName: ''
    }
  },
  methods: {
    submitInForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.goLogin()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goLogin () {
      console.log(this.inForm)
      this.axios.post('user/token', this.inForm).then((response) => {
        console.log(response)
        if (response.data.msg === 'OK') {
          this.$notify({
            title: '成功',
            message: '登陆成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', response.data.body.token)
          this.nickName = response.data.body.user.nickname
          // window.sessionStorage.setItem('nickname', response.data.body.nickname)
          this.checkToken()
          this.visibleSignIn = !this.visibleSignIn
        } else {
          this.$notify.error({
            title: '错误',
            message: response.data.msg
          })
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    signin () {
      this.visibleSignUp = this.visibleSignIn
      this.visibleSignIn = !this.visibleSignIn
    },
    signup () {
      this.visibleSignIn = this.visibleSignUp
      this.visibleSignUp = !this.visibleSignUp
    },
    checkToken () {
      if (window.sessionStorage.getItem('token')) {
        this.visibleSignBt = false
      }
    }

  },
  mounted () {
    this.getMeatList()
    this.checkToken()
  },
  created () {

  }
}
</script>

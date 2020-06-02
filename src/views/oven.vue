<template>
  <div class="oven">
    <div>
      <div class="creatMeatButton">
        <el-button type="text" @click.native="dialogCreate"><img src="../assets/pic/Button.png"></el-button>
      </div>
      <el-card class="card">
        <el-scrollbar style="height:100%">
          <el-row v-if="meatList.length > 0">
            <el-col :span="24"
                    v-for="(meat, index) of meatList"
                    :key="index"
            >
              <div class="swan-card">
                <el-card shadow="hover">
                  <span class="meat-content">{{meat.content}}</span>
                  <span class="meat-status">
                  <div class="statuss">{{meatStatus(meat.status)}}</div>
                  <div class="target">{{meat.time | formatDate}}</div>
                  <div class="meatStatusDrop">
                    <el-dropdown v-if="meat.status === 1"  trigger="click" @command="handleCommand">
                      <img src="../assets/pic/dish.png" style="width: 40px">
                      <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="2">吃到了</el-dropdown-item>
                      <el-dropdown-item command="3">下次一定</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </span>
                </el-card>
              </div>

            </el-col>
          </el-row>
        </el-scrollbar>
      </el-card>
    </div>
    <el-dialog title="菜单" :visible.sync="visibleCreate" custom-class="swan-dialog"
               top="200px"
               :modal="false"
               :destroy-on-close="true"
    >
      <el-form :model="createMeatForm" :rules="createMeatRules" ref="createMeatForm" class="swan-input">
        <el-form-item label="天鹅肉" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="取个名字吧"
            v-model="createMeatForm.content">
          </el-input>
        </el-form-item>
        <el-form-item label="加热时间" prop="target_time" class="target-time">
          <el-date-picker
            v-model="createMeatForm.target_time"
            type="datetime"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="短信提醒" prop="notification">
          <el-switch
            v-model="createMeatForm.notification"
          >
          </el-switch>
          <span v-if="createMeatForm.notification" style="font-size: 7px; font-weight: bold">  技术原因待开发</span>
        </el-form-item>
        <el-form-item class="submit-bt">
          <span class="login-bt">
              <el-button type="primary" @click="submitMeatForm">PUSH!</el-button>
            </span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="吃了吗" :visible.sync="visibleCreate" custom-class="swan-dialog"
               top="200px"
               :modal="false"
               :destroy-on-close="true"
    >

    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '../assets/js/formatDate'

export default {
  name: 'oven',
  props: ['activeName'],
  data () {
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('快给这块肉取个名儿！'))
      } else {
        if (value.length < 3) {
          callback(new Error('哥哥 至少三个字吧！'))
        }
        callback()
      }
    }
    const validateTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('设定个加热时间！'))
      } else {
        callback()
      }
    }
    return {
      geetestStatus: false,
      visibleCreate: false,
      meatList: [],
      createMeatForm: {
        content: '',
        target_time: '',
        notification: false
      },
      createMeatRules: {
        content: [
          { validator: validateContent, trigger: 'blur' }
        ],
        target_time: [
          { validator: validateTime, trigger: 'blur' }
        ]
        // notification: [
        //   { validator: validateNotification, trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    handleCommand (command) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('meat/status').then(res => {

        })

        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    dialogCreate () {
      this.visibleCreate = true
    },
    meatStatus (status) {
      if (status === 0) return '还没熟'
      if (status === 1) return '到点啦'
      if (status === 2) return '吃到啦'
      if (status === 3) return '下次一定'
    },
    getMeatList () {
      this.axios
        .get('meat/')
        .then(response => {
          if (response.data.msg === 'OK') {
            // console.log(response.data)
            this.meatList = response.data.body
            console.log(this.meatList)
          }
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
          product: 'bind',
          width: '200px'
        },
        (captchaObj) => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          // captchaObj.appendTo('#captchaPhoneBox')
          captchaObj.onReady(() => {
            captchaObj.verify()
          }).onSuccess(() => {
            this.validResult = captchaObj.getValidate()
            console.log(this.validResult)
            this.axiosValidate()
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
    axiosValidate () {
      // eslint-disable-next-line no-undef
      this.axios.post('base/geetest/axiosvalidate', this.validResult).then(res => {
        this.geetestStatus = res.data.status
        if (this.geetestStatus) {
          this.pushMest()
        } else {
          this.$notify.error({
            title: 'error',
            message: '验证错误稍后再试'
          })
        }
      })
    },
    pushMest () {
      console.log(this.createMeatForm)
      this.axios.post('meat/create', this.createMeatForm).then(response => {
        console.log(response)
        if (response.data.msg === 'OK') {
          this.$notify({
            title: '成功',
            message: '成功塞进烤箱啦！',
            type: 'success'
          })
          this.visibleCreate = false
          this.getMeatList()
        } else {
          if (response.data.identifier === 'MEAT_QUANTITY') {
            this.$notify({
              title: '失败',
              message: '宝贝 事不过三哦~~',
              type: 'error'
            })
          } else {
            this.$notify({
              title: '失败',
              message: response.data.msg,
              type: 'error'
            })
          }
        }
      })
    },
    submitMeatForm () {
      this.$refs.createMeatForm.validate((valid) => {
        if (valid) {
          this.getGeetest()
        } else {
          return false
        }
      })
    }
  },
  watch: {
    activeName (value) {
      if (value === 'oven') {
        // console.log('oven')
        this.getMeatList()
      }
    }
  },
  filters: {
    formatDate (time) {
      time = time * 1000
      const date = new Date(time)
      // console.log(new Date(time))
      return formatDate(date, 'yyyyMMdd')
    }
  },
  created () {
  },
  mounted () {
    this.getMeatList()
  }
}
</script>

<style scoped>
  .el-dropdown-menu__item {
    font-size: 20px;

  }
  .el-dropdown-menu__item:focus {
    background-color: #e6f2f2;
    /* color: #339999; */
  }
</style>

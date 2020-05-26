<template>
  <div class="oven">
    <div >
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
                  <div class="statuss" >{{meatStatus(meat.status)}}</div>
                  <div class="target" >{{meat.time | formatDate}}</div>
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
          </el-switch><span v-if="createMeatForm.notification" style="font-size: 7px; font-weight: bold">  技术原因待开发</span>
        </el-form-item>
        <el-form-item class="submit-bt">
          <span class="login-bt">
              <el-button type="primary" @click="submitMeatForm">PUSH!</el-button>
            </span>
        </el-form-item>
      </el-form>
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
    submitMeatForm () {

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

</style>

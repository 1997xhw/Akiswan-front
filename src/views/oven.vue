<template>
  <div class="oven">
    <div >
      <el-card class="card">
        <div class="creatMeatButton">
          <el-button type="text"></el-button>
        </div>
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
  </div>
</template>

<script>
import { formatDate } from '../assets/js/formatDate'

export default {
  name: 'oven',
  props: ['activeName'],
  data () {
    return {
      meatList: []
    }
  },
  methods: {
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

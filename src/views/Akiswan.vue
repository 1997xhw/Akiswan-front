<template>
<div class="swan">
  <el-container >
    <el-header style="padding: 0" height="100px">
      <div>
        <div class="swan-title"><b>天鹅肉</b></div>
        <div class="swan-sign">
          <span class="swan-signin">Sign in</span>
          <span> | </span>
          <span class="swan-signup">Sign up</span>
        </div>
      </div>
    </el-header>
    <el-main style="padding: 0">
      <div class="swan-tabs">
        <el-tabs v-model="activeName" >
          <el-tab-pane label="烤箱" name="oven"><oven :activeName="activeName"></oven></el-tab-pane>
          <el-tab-pane label="橱窗" name="window"><window :activeName="activeName"></window></el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </el-container>
</div>
</template>

<script>
import Oven from './oven'
import Window from './window'
export default {
  name: 'Akiswan',
  components: { Window, Oven },
  data () {
    return {
      activeName: 'window'
    }
  },
  methods: {
    // handleClick (tab, event) {
    //   console.log(tab, event)
    // },

  },
  mounted () {
    // this.getMeatList()
  },
  created () {
    this.getMeatList()
  }
}
</script>

<style scoped>

</style>

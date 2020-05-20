<template>
<div class="window">
<el-card class="card">

</el-card>
</div>
</template>

<script>
export default {
  name: 'window',
  props: ['activeName'],
  data () {
    return {
      meatList: []
    }
  },
  methods: {
    getMeatList () {
      var vm = this
      this.axios
        .get('meat/pool')
        .then(response => {
          if (response.data.msg === 'OK') {
            // console.log(response.data)
            vm.meatList = response.data.body
            console.log(vm.meatList)
          }
        })
    }
  },
  watch: {
    activeName (value) {
      if (value === 'window') {
        console.log('window')
        this.getMeatList()
      }
    }
  }
}
</script>

<style scoped>

</style>

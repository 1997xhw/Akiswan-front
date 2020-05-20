<template>
  <div class="oven">
    <div >
      <el-card class="card"></el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'oven',
  props: ['activeName'],
  watch: {
    activeName (value) {
      if (value === 'oven') {
        console.log('oven')
      }
    }
  }
}
</script>

<style scoped>

</style>

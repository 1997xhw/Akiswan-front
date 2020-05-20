<template>
  <div class="oven">
    <el-card class="card"></el-card>
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

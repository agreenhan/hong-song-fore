<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      欢迎进入洪松公司员工综合考评系统
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    font-family: "PingFang SC";
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    text-align: center;
  }
}
</style>

<template>
  <div class="container-view">
    <van-button type="primary" @click="goOne">主要按钮</van-button>
    <van-button type="success">成功按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <van-cell-group inset>
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" label="描述信息" />
    </van-cell-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'

export default defineComponent({
  name: 'Home',
  setup () {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)

    /* function setLoginStatus (loginStatus: number) {
      store.dispatch('setLoginStatus', loginStatus)
    } */
    const goOne = () => {
      router.push({
        path: '/landing'
      })
    }
    return {
      loginStatus,
      accessToken,
      userInfo,
      goOne
      // setLoginStatus
    }
  }
})
</script>

<style lang="less" scoped>
.container-view {
  height: 100vh;
  background: #f7f8fa;
}
</style>

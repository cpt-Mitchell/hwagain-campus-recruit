<template>
  <div class="container-view">
    <div>
      <img  style="width: 100vw; height: 65vh;" :src="banner" />
    </div>
    <div>
      <div class="nameSchool">
        <div class="logo">
          <img style="height: 7vh;" :src="logo" />
        </div>
        <div class="one-box"></div>
        <div class="text-box">
          <div style="font-size: 16px; text-align: left;">姓名：{{ userInfo.ambName }}</div>
          <div style="font-size: 16px; text-align: left;">学校：{{ userInfo.universityName }}</div>
        </div>
      </div>
      <div class="button-b">
        <div class="button-bottom">
          <van-button color="#F69C00" round style="width: calc(100% - 90px);" @click="input">信息发布截图上传</van-button>
        </div>
        <div class="button-bottom">
          <!-- <van-button color="#F69C00" round style="width: calc(100% - 90px);" @click="query">招聘单位薪酬收集</van-button> -->
          <van-button color="#F69C00" round style="width: calc(100% - 90px);" @click="query">招聘单位薪资调查</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'

export default defineComponent({
  name: 'landing',
  setup() {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)

    const state = reactive({
      loginStatus,
      accessToken,
      userInfo,
      banner: require('@/assets/img/banner.jpg'),
      logo: require('@/assets/img/sub-logo.png'),
    })
    const query = () => {
      router.push({
        path: '/station',
        query: {
          schoolLevel: state.userInfo.schoolLevel,
        },
      })
    }
    const input = () => {
      router.push({
        path: '/sendMsgHome',
      })
    }
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      query,
      input,
      // setLoginStatus
    }
  },
})
</script>

<style lang="less" scoped>
.container-view {
  height: 100vh;
  background: #f7f8fa;
}

.box-view {
  padding-top: 10px;
}

.button-bottom {
  padding: 10px 0;
  text-align: center;
}

.button-bottom:last-child {
  padding-bottom: 0;
}

.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button-b {
}

.nameSchool {
  display: flex;
  align-items: center;
  margin-left: 47px;
  padding-top: 10px;
}

.one-box {
  width: 5px;
  height: 6vh;
  margin-right: 10px;
  background-color: #f59c00;
}

.logo {
  margin-right: 10px;
}
</style>

<template>
  <div class="container-view">
    <div class="box-view">
      <van-cell-group class="cell-group" inset>
        <div class="text-box">
          <div class="text-top">
            <span>校园大使{{ userInfo.ambName }}：</span>
            <br />
            <div style="text-indent: 28px;">您好！感谢您对我司校招工作的鼎力支持！请您按如下要求在负责的院系官方就业群发布我司的招聘信息，并进入本界面上传信息发布的截图。</div>
            <div style="text-indent: 28px;">1、发布时间：每周周三晚上21:00-22:00。</div>
            <div style="text-indent: 28px;">2、发布次数：至少连续两周共发布2次（若能连续三周发布最佳）。</div>
          </div>
          <div class="button-b">
            <div class="button-bottom">
              <van-button color="#F69C00" round style="width: calc(100% - 50px);" @click="input">信息发布截图上传</van-button>
            </div>
            <div class="button-bottom">
              <van-button color="#F69C00" round style="width: calc(100% - 50px);" @click="query">已上传信息查阅</van-button>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
export default defineComponent({
  name: 'landing',
  setup () {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)

    const state = reactive({
      loginStatus,
      accessToken,
      userInfo
    })
    const query = () => {
      router.push({
        path: '/sendMsgList'
      })
    }
    const input = () => {
      router.push({
        path: '/sendMsgInput'
      })
    }
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      query,
      input
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

.box-view {
  padding-top: 10px;
}

.button-bottom {
  padding: 10px 0;
  text-align: center;
}

.text-box {
}

.cell-group {
  height: calc(100vh - 20px);
}

.button-b {
  margin-top: 20px;
}

.text-top {
  padding: 10px;
}
</style>

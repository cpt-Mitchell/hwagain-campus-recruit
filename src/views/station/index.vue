<template>
  <div class="container-view">
    <div class="box-view">
      <van-cell-group inset class="cell-group">
        <div style="min-height: 40vh;">
          <div class="text-box" v-if="userInfo.schoolLevel == 1">
            <div></div>
            <span>校园大使{{ userInfo.ambName }}：</span>
            <br />
            <div style="text-indent: 28px;">您好！感谢您对我司校招工作的鼎力支持！现需要您帮助我司搜集其它知名企业的招聘岗位及薪酬信息。</div>
          </div>
          <div class="text-box" v-else>
            <span>校园大使{{ userInfo.ambName }}：</span>
            <br />
            <div style="text-indent: 28px;">您好！感谢您对我司校招工作的鼎力支持！现需要您帮助我司搜集其它企业（请重点关注知名企业、制造业）招聘以下专业公布的岗位及薪酬信息：</div>
            <br />
            <span style="color: red;">{{ majorName }}</span>
          </div>
        </div>
        <div>
          <div class="foot-button">
            <van-button color="#F69C00" round style="width: calc(100% - 50px);" @click="input">薪资调查目标企业及人数</van-button>
            <!-- <van-button color="#F69C00" round style="width: calc(100% - 50px);" @click="input">招聘单位薪酬信息录入</van-button> -->
          </div>
          <div class="foot-button">
            <van-button color="#F69C00" round style="width: calc(100% - 50px);" @click="query">填报人填报状况查询</van-button>
            <!-- <van-button color="#F69C00" round style="width: calc(100% - 50px);" @click="query">已录入信息查阅</van-button> -->
          </div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import CommonServer from '@/api/common'
import { setLoadingStatus } from '@/utils/index'

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
      userInfo,
      majorName: ''
    })

    /* function setLoginStatus (loginStatus: number) {
        store.dispatch('setLoginStatus', loginStatus)
      } */
    const getMajorList = async () => {
      setLoadingStatus(true, '正在查询...')
      const ambassId = state.userInfo.id
      const res = (await CommonServer.getMajorList(ambassId)) || []
      setLoadingStatus(false)
      state.majorName = ''
      if (res instanceof Array) {
        if (res.length > 0) {
          res.forEach((item: any) => {
            if (item.targetMajorName) {
              state.majorName = state.majorName ? state.majorName + '、' + item.targetMajorName : item.targetMajorName
            }
          })
        }
      }
    }
    const query = () => {
      router.push({
        // path: '/collectionList'
        path: '/examineConsult'
      })
    }
    const input = () => {
      router.push({
        // path: '/collectionInput'
        path: '/examineList'
      })
    }
    onMounted(() => {
      getMajorList()
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      query,
      input,
      getMajorList
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

.foot-button {
  padding: 10px 0;
  text-align: center;
}

.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}

.cell-group {
  height: calc(100vh - 20px);
}
</style>

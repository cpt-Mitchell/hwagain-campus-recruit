<template>
  <div class="container-view">
    <div class="box-view">
      <van-cell-group inset>
        <van-field v-model="form.mobile" @change="changeMobile" name="手机号码" label="手机号码" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]" />
        <van-field v-model="form.checkCode" name="验证码" label="验证码" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]">
          <template #button>
            <van-button :disabled="disabled" color="#F69C00" size="mini" @click="sendMsg" style="margin-right: 5px;">{{ text }}</van-button>
            <van-button color="#F69C00" size="mini" @click="query">查询</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group style="margin-top: 10px;" inset>
        <van-field :readonly="true" v-model="form.name" name="姓名" label="姓名" />
        <van-field :readonly="true" v-model="form.school" name="学校名称" label="学校名称" />
        <van-field :readonly="true" v-model="form.faculty" name="负责院系" label="负责院系" />
        <!-- <van-field :readonly="true" v-model="form.education" name="负责学历范围" label="负责学历范围" /> -->
      </van-cell-group>
      <div class="button-bottom">
        <van-button :disabled="confirmDisable" color="#F69C00" round style="width: 140px;" size="small" @click="confirm">注册登录</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import CommonServer from '@/api/common'
import { setLoadingStatus } from '@/utils/index'
import { Toast } from 'vant'

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
      text: '发送验证码',
      min: 60,
      id: '',
      timer: 0,
      disabled: false,
      confirmDisable: true,
      schoolLevel: '',
      form: {
        mobile: '',
        name: '',
        school: '',
        faculty: '',
        education: '',
        checkCode: '',
      },
    })

    /* function setLoginStatus (loginStatus: number) {
      store.dispatch('setLoginStatus', loginStatus)
    } */
    const changeMobile = () => {
      state.id = ''
      state.form.name = ''
      state.form.school = ''
      state.form.faculty = ''
      state.form.education = ''
      state.form.checkCode = ''
      state.confirmDisable = true
    }
    const sendMsg = async () => {
      if (state.form.mobile.length === 11) {
        setLoadingStatus(true, '正在发送验证码...')
        const data = { mobile: state.form.mobile }
        const res = await CommonServer.sendMsg(data)
        setLoadingStatus(false)
        state.timer = window.setInterval(function () {
          state.disabled = true
          state.text = state.min + 's'
          state.min--
          if (state.min <= 0) {
            clearInterval(state.timer)
            state.disabled = false
            state.text = '发送验证码'
          }
        }, 1000)
      } else {
        Toast({ message: '请输入正确的手机号码后再进行提交' })
      }
    }
    const query = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { ambMobile: state.form.mobile, checkCode: state.form.checkCode }
      const res = await CommonServer.queryPersonalInfo(data)
      setLoadingStatus(false)
      state.id = res.id
      state.form.name = res.ambName
      state.form.school = res.universityName
      state.form.faculty = res.responsibleCollege
      state.form.education = res.responsibleDegree
      state.schoolLevel = res.schoolLevel
      state.confirmDisable = false
    }
    const confirm = async () => {
      setLoadingStatus(true, '正在注册...')
      const data = { id: state.id, openid: state.userInfo.openid }
      const res = await CommonServer.confirmLanding(data)
      setLoadingStatus(false)
      const info = state.userInfo
      info.id = res.id
      info.ambName = state.form.name
      info.universityName = state.form.school
      info.responsibleCollege = state.form.faculty
      info.responsibleDegree = state.form.education
      info.schoolLevel = state.schoolLevel
      await store.dispatch('setAccessToken', res.ambassToken)
      await store.dispatch('setUserInfo', info)
      await store.dispatch('setLoginStatus', 3)
      goOne()
    }
    const goOne = () => {
      router.replace({
        path: '/',
      })
    }
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      goOne,
      sendMsg,
      query,
      changeMobile,
      confirm,
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
  padding-top: 10px;
  text-align: center;
}
</style>

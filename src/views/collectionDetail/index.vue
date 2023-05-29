<template>
  <div class="container-view">
    <div class="box-view">
      <van-form>
        <van-cell-group inset style="margin-top: 20px;">
          <van-row class="title-row">
            <van-col span="12">
              <span>收集人：{{ userInfo.ambName }}</span>
            </van-col>
            <van-col span="12" align="right">
              <span>学校：{{ userInfo.universityName }}</span>
            </van-col>
          </van-row>
        </van-cell-group>
        <van-cell-group style="margin-top: 20px;" inset v-if="form.checkStatus === '通过' || form.checkStatus === '不通过'">
          <van-field center readonly v-model="form.checkStatus" name="审核结果" label="审核结果">
            <template #button>
              <van-button color="#F69C00" size="small" @click="changeInfo" v-if="form.checkStatus === '不通过'">修改</van-button>
            </template>
          </van-field>
          <van-field v-if="form.checkStatus === '不通过'" readonly v-model="form.checkRemarks" name="不通过原因" label="不通过原因" />
        </van-cell-group>
        <van-row class="title-row">
          <van-col span="24">
            <span style="font-weight: bold;">单位信息</span>
          </van-col>
        </van-row>
        <van-cell-group inset>
          <van-field readonly v-model="form.enterpriseName" name="企业名称" label="企业名称" />
          <van-field readonly v-model="form.belongType" name="所属行业" label="所属行业" />
        </van-cell-group>
        <van-row class="title-row">
          <van-col span="24">
            <span style="font-weight: bold;">岗位信息</span>
          </van-col>
        </van-row>
        <van-cell-group inset>
          <van-field readonly v-model="form.jobName" name="招聘岗位" label="招聘岗位" />
          <van-field readonly v-model="form.workplace" name="工作地点" label="工作地点" />
          <van-field readonly v-model="form.majorName" name="专业" label="专业" />
          <van-field readonly v-model="form.num" name="招聘人数" label="招聘人数" />
          <van-field readonly name="学历" label="学历" v-model="form.degree" />
        </van-cell-group>
        <van-row class="title-row">
          <van-col span="24">
            <span style="font-weight: bold;">薪酬信息</span>
          </van-col>
        </van-row>
        <van-cell-group inset>
          <template v-if="form.degree.indexOf('本科') !== -1">
            <van-row>
              <van-col class="box-title" span="24">
                <span>本科</span>
              </van-col>
            </van-row>
            <van-field readonly name="月薪(元)" label="月薪(元)" v-model="form.benMonthlyPay" />
            <van-field readonly v-model="form.bsystem" name="薪制" label="薪制">
              <template #extra>
                <span>薪</span>
              </template>
            </van-field>
            <van-field readonly v-model="form.byearSalary" name="年薪" label="年薪">
              <template #extra>
                <span>万元</span>
              </template>
            </van-field>
          </template>
          <template v-if="form.degree.indexOf('硕士') !== -1">
            <van-row>
              <van-col class="box-title" span="24">
                <span>硕士</span>
              </van-col>
            </van-row>
            <van-field readonly name="月薪(元)" label="月薪(元)" v-model="form.shuoMonthlyPay" />
            <van-field readonly v-model="form.msystem" name="薪制" label="薪制">
              <template #extra>
                <span>薪</span>
              </template>
            </van-field>
            <van-field readonly v-model="form.myearSalary" name="年薪" label="年薪">
              <template #extra>
                <span>万元</span>
              </template>
            </van-field>
          </template>
        </van-cell-group>
        <van-cell-group style="margin-top: 15px; margin-bottom: 20px;" inset>
          <van-field readonly type="textarea" v-model="form.structDesc" name="薪酬结构说明" label="薪酬结构说明" />
          <van-field readonly type="textarea" v-model="form.treatment" name="福利待遇" label="福利待遇" />
          <van-field center style="width: 47vw;" readonly name="uploader" label="材料上传（拍照、截图等）">
            <template #extra>
              <van-button size="small" color="#F69C00" @click="imgPreview">查看</van-button>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import { ImagePreview, Toast } from 'vant'
import CommonServer from '@/api/common'
import { setLoadingStatus } from '@/utils/index'

export default defineComponent({
  name: 'landing',
  setup() {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)
    type tableItem = {
      fileUrl: string
      fileName: string
    }
    type urlItem = string
    type degreeItem = any

    const state = reactive({
      loginStatus,
      accessToken,
      userInfo,
      url: [] as urlItem[],
      form: {
        ambPlanambassid: '',
        enterpriseName: '',
        belongType: '',
        jobName: '',
        workplace: '',
        majorName: '',
        num: '',
        isMore: false,
        degreeArr: [] as degreeItem[],
        degree: '',
        bminSalary: '',
        bmaxSalary: '',
        bsystem: '',
        byearSalary: '',
        mminSalary: '',
        mmaxSalary: '',
        msystem: '',
        myearSalary: '',
        structDesc: '',
        treatment: '',
        status: 10,
        fileList: [] as tableItem[],
        result: '',
        checkStatus: '',
        checkRemarks: '',
        benMonthlyPay: '',
        shuoMonthlyPay: '',
      },
    })

    /* function setLoginStatus (loginStatus: number) {
        store.dispatch('setLoginStatus', loginStatus)
      } */
    const imgPreview = () => {
      if (state.url.length > 0) {
        ImagePreview(state.url)
      } else {
        Toast({ message: '暂无图片' })
      }
    }
    const changeInfo = () => {
      router.push({
        path: '/collectionInput',
        query: {
          id: router.currentRoute.value.query.id,
          checkStatus: state.form.checkStatus || ''
        },
      })
    }
    const getList = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { id: router.currentRoute.value.query.id }
      const res = (await CommonServer.getOneCollectionDetail(data)) || []
      setLoadingStatus(false)
      state.form = res
      state.url = []
      state.form.benMonthlyPay = state.form.bminSalary + '-' + state.form.bmaxSalary
      state.form.shuoMonthlyPay = state.form.mminSalary + '-' + state.form.mmaxSalary
      if (state.form.fileList.length > 0) {
        state.form.fileList.forEach((item: any) => {
          if (item.fileName && item.fileUrl) {
            state.url.push(item.fileUrl)
          }
        })
      }
    }
    onMounted(() => {
      getList()
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      changeInfo,
      imgPreview,
      getList,
      // setLoginStatus
    }
  },
})
</script>

<style lang="less" scoped>
.container-view {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
}

.box-view {
  // margin-bottom: 60px;
}

.foot-button {
  position: fixed;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 44px;
  background-color: #fff;
}

.title-row {
  padding: 0 15px;
  line-height: 50px;
}

.box-title {
  padding: 15px;
  font-weight: bold;
}

.field-input {
  width: 80px;
  text-align: center;
  border: none;
}
</style>

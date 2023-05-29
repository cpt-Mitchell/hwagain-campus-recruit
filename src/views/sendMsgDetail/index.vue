<template>
  <div class="container-view">
    <div class="box-view">
      <van-form>
        <van-cell-group inset style="margin: 20px;">
          <van-row class="title-row">
            <van-col span="12">
              <span>上传人：{{ userInfo.ambName }}</span>
            </van-col>
            <van-col span="12" align="right">
              <span>学校：{{ userInfo.universityName }}</span>
            </van-col>
          </van-row>
        </van-cell-group>
        <van-cell-group style="margin-bottom: 20px;" inset v-if="form.checkStatus === '通过' || form.checkStatus === '不通过'">
          <van-field center readonly v-model="form.checkStatus" name="审核结果" label="审核结果">
            <template #button>
              <van-button color="#F69C00" size="small" @click="changeInfo" v-if="form.checkStatus === '不通过'">修改</van-button>
            </template>
          </van-field>
          <van-field v-if="form.checkStatus === '不通过'" readonly v-model="form.remarks" name="不通过原因" label="不通过原因" />
        </van-cell-group>
        <van-cell-group inset>
          <van-field readonly v-model="form.collegeName" name="院系名称" label="院系名称" />
          <van-field readonly v-model="form.publishDate" name="发布时间" label="发布时间" />
          <van-field readonly v-model="form.groupName" name="群名称" label="群名称" />
          <van-field readonly v-model="form.groupType" name="群类别" label="群类别" />
          <van-field readonly v-model="form.groupDegree" name="群成员学历" label="群成员学历" />
          <van-field readonly v-model="form.count" name="群人数" label="群人数" />
          <van-field center readonly style="width: 47vw;" name="uploader" label="截图预览">
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
import CommonServer from '@/api/common'
import { setLoadingStatus } from '@/utils/index'
import { ImagePreview, Toast } from 'vant'

export default defineComponent({
  name: 'landing',
  setup () {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)
    type tableItem = {
      fileUrl: string
      fileName: string
    }
    type urlItem = string
    const state = reactive({
      loginStatus,
      accessToken,
      userInfo,
      url: [] as urlItem[],
      columns: [],
      form: {
        ambPlanambassid: '',
        collegeName: '',
        collegeID: '',
        publishDate: '',
        groupName: '',
        groupType: '',
        count: '',
        status: 10,
        fileList: [] as tableItem[],
        checkStatus: '',
        remarks: '',
        groupDegree: ''
      },
    })
    const imgPreview = () => {
      if (state.url.length > 0) {
        ImagePreview(state.url)
      } else {
        Toast({ message: '暂无图片' })
      }
    }
    const changeInfo = () => {
      router.push({
        path: '/sendMsgInput',
        query: {
          id: router.currentRoute.value.query.id,
          checkStatus: state.form.checkStatus || ''
        },
      })
    }
    const getList = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { id: router.currentRoute.value.query.id }
      const res = (await CommonServer.getOneSendMsgDetail(data)) || []
      setLoadingStatus(false)
      state.form = res
      state.url = []
      if (state.form.fileList.length > 0) {
        state.form.fileList.forEach((item: any) => {
          if (item.fileName && item.fileUrl) {
            state.url.push(item.fileUrl)
          }
        })
      }
      if (state.form.publishDate) {
        state.form.publishDate = state.form.publishDate.substring(0, 16)
      }
      if (router.currentRoute.value.query.collegeName) {
        state.form.collegeName = router.currentRoute.value.query.collegeName as string
      }
    }
    onMounted(() => {
      if (router.currentRoute.value.query.id) {
        getList()
      }
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      getList,
      imgPreview,
      changeInfo,
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
  margin-bottom: 60px;
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

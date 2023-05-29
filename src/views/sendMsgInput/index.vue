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
        <van-cell-group inset>
          <van-field v-model="form.collegeName" is-link readonly label="院系名称" placeholder="点击选择" @click="showPicker = true" />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker :columns="collegeColumns" @cancel="showPicker = false" @confirm="onConfirm" />
          </van-popup>
          <van-field v-model="form.publishDateShow" is-link readonly name="datetimePicker" label="发布时间" placeholder="选择时间" @click="showTimePicker = true" />
          <van-popup v-model:show="showTimePicker" position="bottom">
            <van-datetime-picker :max-date="maxDate" v-model="form.publishDateNoformatter" :columns-order="['year', 'month', 'day', 'hour', 'minute']" :formatter="formatter" type="datetime" @confirm="timeConfirm" @cancel="showTimePicker = false" />
          </van-popup>
          <van-field v-model="form.groupName" name="群名称" label="群名称" placeholder="请录入一个群名称" :rules="[{ required: true, message: '请录入' }]" />
          <van-field v-model="form.groupType" is-link readonly label="群类别" placeholder="点击选择" @click="showTypePicker = true" />
          <van-popup v-model:show="showTypePicker" position="bottom">
            <van-picker :columns="typeCollums" @cancel="showTypePicker = false" @confirm="typeConfirm" />
          </van-popup>
          <van-field name="群成员学历" label="群成员学历">
            <template #input>
              <van-checkbox-group v-model="degreeArr" @change="changeDegree" direction="horizontal">
                <van-checkbox shape="square" name="本科">本科</van-checkbox>
                <van-checkbox shape="square" name="硕士">硕士</van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field>
          <van-field v-model="form.count" type="number" name="群人数" label="群人数" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]" />
          <van-field name="uploader" label="截图上传">
            <template #input>
              <van-uploader preview-size="62" :before-delete="beforeDelete" :after-read="afterRead" v-model="url" multiple />
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
      <div style="padding: 20px; color: red; font-size: 13px;">提示：不同群名称的截图需分开上传，否则审核不通过！</div>
    </div>
    <div class="foot-button" v-if="checkStatus === '审核中' || checkStatus === '不通过'">
      <van-button style="width: 100%;" color="#F69C00" @click="confirm">提交审核</van-button>
    </div>
    <div class="foot-button" v-else>
      <van-button style="width: 50%;" type="primary" @click="save">未提交保存</van-button>
      <van-button style="width: 50%;" color="#F69C00" @click="confirm">提交审核</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import CommonServer from '@/api/common'
import { dateFormat, setLoadingStatus } from '@/utils/index'
import { Toast, Dialog } from 'vant'

export default defineComponent({
  name: 'landing',
  setup() {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)
    const loadingObj = computed(() => store.state.loadingObj)
    type tableItem = {
      fileUrl: string
      fileName: string
      fileId: string
    }
    type urlItem = {
      url: string
    }
    type columnsItem = any
    type collegeItem = any
    type degreeItem = any
    const date = new Date()
    const formatterDate = dateFormat(date, 'YYYY-MM-DD HH:mm')
    const query = router.currentRoute.value.query
    const state = reactive({
      loadingObj,
      loginStatus,
      accessToken,
      userInfo,
      checkStatus: query.checkStatus || '',
      showPicker: false,
      showTimePicker: false,
      showTypePicker: false,
      degreeArr: [] as degreeItem[],
      columns: [] as columnsItem[],
      collegeColumns: [] as collegeItem[],
      typeCollums: ['微信', 'QQ'],
      url: [] as urlItem[],
      maxDate: new Date(),
      form: {
        id: '',
        ambPlanambassid: '',
        collegeName: '',
        collegeID: '',
        publishDateNoformatter: new Date(Number(formatterDate.substring(0, 4)), Number(formatterDate.substring(5, 7)) - 1, Number(formatterDate.substring(8, 10)), 0, 0),
        // publishDateShow: dateFormat(date, 'YYYY-MM-DD') + ' 00:00',
        publishDateShow: '',
        // publishDate: dateFormat(date, 'YYYY-MM-DD HH:mm') + ':00',
        publishDate: '',
        groupName: '',
        groupType: '',
        count: '',
        status: 10,
        fileList: [] as tableItem[],
        groupDegree: ''
      },
    })
    const changeDegree = () => {
      state.form.groupDegree = ''
      if (state.degreeArr.length > 0) {
        state.form.groupDegree = state.degreeArr.join(',')
      }
    }
    const formatter = (type: string, val: string) => {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      if (type === 'hour') {
        return val + '时'
      }
      if (type === 'minute') {
        return val + '分'
      }
      return val
    }
    const save = async () => {
      if (state.form.collegeName && state.form.groupName) {
        setLoadingStatus(true, '正在保存...')
        if (!state.form.ambPlanambassid) {
          state.form.ambPlanambassid = state.userInfo.id
        }
        if (state.form.fileList.length > 0) {
          state.form.fileList.forEach((item: any, index: number) => {
            if (!item.fileName && !item.fileUrl) {
              state.form.fileList.splice(index, 1)
            }
          })
        }
        state.form.status = 10
        const data = state.form
        const res = await CommonServer.confirmSendMsg(data)
        setLoadingStatus(false)
        if (res) {
          Toast({ message: res })
        }
        if (res === '保存成功') {
          router.go(-1)
        }
      } else {
        Toast({ message: '请至少录入院系名称和群名称后再进行暂存' })
      }
    }
    const confirm = () => {
      if (state.form.fileList.length > 0) {
        if (state.form.collegeName && state.form.publishDate && state.form.groupName && state.form.groupType && state.form.count && state.form.groupDegree) {
          submit()
        } else {
          Toast({ message: '请检查是否录入完整再进行提交' })
        }
      } else {
        Toast({ message: '请上传截图后再进行提交' })
      }
    }
    const submit = () => {
      Dialog.confirm({
        title: '提交',
        message: '确定提交？',
      })
        .then(() => {
          submitPromise()
        })
        .catch(() => {
          // on cancel
        })
    }
    const submitPromise = async () => {
      setLoadingStatus(true, '正在提交...')
      const postArr = JSON.parse(JSON.stringify(state.form))
      delete postArr.publishDateShow
      delete postArr.publishDateNoformatter
      if (!postArr.ambPlanambassid) {
        postArr.ambPlanambassid = state.userInfo.id
      }
      if (postArr.fileList.length > 0) {
        postArr.fileList.forEach((item: any, index: number) => {
          if (!item.fileName && !item.fileUrl) {
            postArr.fileList.splice(index, 1)
          }
        })
      }
      postArr.status = 20
      const data = postArr
      const res = (await CommonServer.confirmSendMsg(data)) || []
      setLoadingStatus(false)
      if (res) {
        Toast({ message: res })
      }
      if (res === '提交成功') {
        router.go(-1)
      }
    }
    const afterRead = async (file: any) => {
      setLoadingStatus(true, '正在上传文件...')
      try {
        const formData = new FormData()
        if (!(file instanceof Array)) {
          formData.append('files', file.file)
        } else {
          if (file.length > 0) {
            for (const oneFile of file) {
              formData.append('files', oneFile.file)
            }
          }
        }
        const res = await CommonServer.uploadFiles(formData)
        setLoadingStatus(false)
        if (res && res.length > 0) {
          res.forEach((item: any) => {
            const arr = { fileName: item.fileName, fileUrl: item.filePath, fileId: item.fileId + '' }
            state.form.fileList.push(arr)
          })
        } else {
          state.url.pop()
          Toast({ message: '上传失败' })
        }
      } catch (e) {
        setLoadingStatus(false)
      }
    }
    const beforeDelete = (file: any, detail: any) => {
      const index: number = detail.index
      state.form.fileList.splice(index, 1)
      return true
    }
    const typeConfirm = (val: string) => {
      state.form.groupType = val
      state.showTypePicker = false
    }
    const onConfirm = (val: string) => {
      state.form.collegeName = val
      state.columns.forEach((item: any) => {
        if (val === item.collgetName) {
          state.form.collegeID = item.collegeId
        }
      })
      state.showPicker = false
    }
    const timeConfirm = (val: string) => {
      state.form.publishDateShow = dateFormat(val, 'YYYY-MM-DD HH:mm')
      state.form.publishDate = dateFormat(val, 'YYYY-MM-DD HH:mm') + ':00'
      state.showTimePicker = false
    }
    const getCollege = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { ambassId: state.userInfo.id }
      const res = (await CommonServer.getCollege(data)) || []
      setLoadingStatus(false)
      if (res.length > 0) {
        const columns: any[] = []
        res.forEach((item: any) => {
          columns.push(item.collgetName)
        })
        state.collegeColumns = columns
        state.columns = res
        if (router.currentRoute.value.query.id) {
          getList()
        }
      }
    }
    const getList = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { id: router.currentRoute.value.query.id }
      const res = (await CommonServer.getOneSendMsgDetail(data)) || []
      setLoadingStatus(false)
      state.form = res
      if (state.form.publishDate) {
        state.form.publishDateShow = state.form.publishDate.substring(0, 16)
        state.form.publishDateNoformatter = new Date(
          Number(state.form.publishDate.substring(0, 4)),
          Number(state.form.publishDate.substring(5, 7)) - 1,
          Number(state.form.publishDate.substring(8, 10)),
          Number(state.form.publishDate.substring(11, 13)),
          Number(state.form.publishDate.substring(14, 16))
        )
      }
      if (state.form.groupDegree) {
        state.degreeArr = state.form.groupDegree.split(',')
      }
      // state.form.publishDateNoformatter = new Date(Number(state.form.publishDate.substring(0, 4)), Number(state.form.publishDate.substring(5, 7)) - 1, Number(state.form.publishDate.substring(8, 10)), Number(state.form.publishDate.substring(11, 13)), Number(state.form.publishDate.substring(14, 16)))
      if (state.form.fileList.length > 0) {
        state.form.fileList.forEach((item: any) => {
          if (item.fileName && item.fileUrl) {
            const arr = { url: item.fileUrl }
            state.url.push(arr)
          }
        })
      }
      if (state.form.collegeID && state.columns.length > 0) {
        state.columns.forEach((item: any) => {
          if (item.collegeId === state.form.collegeID) {
            state.form.collegeName = item.collgetName
          }
        })
      }
    }
    onMounted(() => {
      getCollege()
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      getCollege,
      onConfirm,
      afterRead,
      confirm,
      save,
      getList,
      timeConfirm,
      typeConfirm,
      beforeDelete,
      submit,
      formatter,
      submitPromise,
      changeDegree,
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
  // iphone 刘海屏优化
  margin-bottom: calc(constant(safe-area-inset-bottom) + 60px);
  margin-bottom: calc(env(safe-area-inset-bottom) + 60px);
}

.foot-button {
  position: fixed;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  min-height: 44px;
  padding-bottom: calc(constant(safe-area-inset-bottom));
  padding-bottom: calc(env(safe-area-inset-bottom));
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

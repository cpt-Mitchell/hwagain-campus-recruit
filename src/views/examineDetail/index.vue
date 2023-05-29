<template>
  <div class="container-view">
    <div class="box-view" style="margin: 10px 0;">
      <van-form>
        <!-- <van-cell-group inset style="margin: 20px;">
          <van-row class="title-row">
            <van-col span="12">
              <span>上传人：{{ userInfo.ambName }}</span>
            </van-col>
            <van-col span="12" align="right">
              <span>学校：{{ userInfo.universityName }}</span>
            </van-col>
          </van-row>
        </van-cell-group> -->
        <van-cell-group inset>
          <van-field v-model="companyName" name="单位" label="单位" readonly />
          <van-field v-model="degree" name="学历" label="学历" readonly />
          <van-field v-model="category" is-link readonly label="薪酬证明类型" placeholder="点击选择" @click="showPicker = true" />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker :columns="typeArr" @cancel="showPicker = false" @confirm="onConfirm" />
          </van-popup>
        </van-cell-group>
      </van-form>
    </div>
    <div class="box-view" style="margin: 10px 0;">
      <van-cell-group inset>
        <table class="table">
          <van-radio-group v-model="jobName">
            <colgroup>
              <col style="width: 20%;" />
              <col />
              <col style="width: 22%;" />
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>招聘岗位</th>
                <th>岗位选择</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tableList.length > 0">
                <tr v-for="(item, index) in tableList || []" :key="index">
                  <td>{{ item.seq }}</td>
                  <td>{{ item.jobName }}</td>
                  <td>
                    <van-radio style="width: 25px; margin: 0 25px;" :name="item.jobName" />
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5" style="padding: 20px;">
                    <span>暂无数据...</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </van-radio-group>
        </table>
      </van-cell-group>
    </div>
    <div class="box-view">
      <van-form>
        <van-cell-group inset>
          <van-field name="uploader" label="图片上传">
            <template #input>
              <van-uploader :multiple="true" preview-size="62" :before-delete="beforeDelete" :after-read="afterRead" :before-read="beforeRead" v-model="url" />
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </div>
    <div class="foot-button">
      <van-button style="width: 50%;" type="primary" @click="explain">说明</van-button>
      <van-button style="width: 50%;" color="#F69C00" @click="submitPromise">提交</van-button>
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
      seq: any
      id: any
      enterPriseID: any
      jobName: string
    }
    type urlItem = {
      url: string
    }
    type typeItem = any
    type degreeItem = any
    const state = reactive({
      loadingObj,
      loginStatus,
      accessToken,
      userInfo,
      id: '',
      companyName: '',
      degree: '',
      jobName: '',
      category: '',
      photoId: '',
      tableList: [] as tableItem[],
      showPicker: false,
      degreeArr: [] as degreeItem[],
      typeArr: ['纸质录取通知书', '电子邮件录取通知书'] as typeItem[],
      url: [] as urlItem[],
      fileList: [],
    })
    const explain = () => {
      Dialog.alert({
        title: '说明',
        messageAlign: 'left',
        message:
          '1、薪资证明类型：\n（1）纸质录取通知书；\n（2）电子邮件录取通知书；\n2、薪资证明类型提供信息要求：\n（1）纸质录取通知书：\n①信息：薪酬信息、招聘单位信息及戳章\n②提供方式：拍照\n（2）电子邮件录取通知书：\n①信息：薪酬信息、招聘单位邮箱地址、招聘单位\n②提供方式：截图\n（3）录取通知书要求全版面拍照或截图。\n3、信息处理：\n（1）处理内容：薪资证明上的学生姓名及手机号码。\n（2）处理方法：通过马赛克打码处理。',
      }).then(() => {
        // on close
      })
    }
    const submitPromise = async () => {
      if (!state.category) {
        Toast({ message: '请选择薪酬证明类型' })
        return false
      } else if (!state.jobName) {
        Toast({ message: '请选择岗位' })
        return false
      } else if (!state.photoId) {
        Toast({ message: '请上传图片后再进行提交' })
        return false
      } else {
        setLoadingStatus(true, '正在提交...')
        const data = { id: state.id, degree: state.degree, jobName: state.jobName, category: state.category, photoId: state.photoId, userName: state.userInfo.ambName }
        const res = (await CommonServer.confirmExamineDetail(data)) || []
        setLoadingStatus(false)
        if (res) {
          Toast({ message: res })
        }
        if (res === '提交成功') {
          router.go(-1)
        }
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
            state.photoId = state.photoId ? state.photoId + ',' + item.fileId : item.fileId
          })
          console.log(state.photoId)
          // state.photoId = res[0].fileId
          // submitPromise()
        } else {
          state.url = []
          Toast({ message: '上传失败,请重新上传' })
        }
      } catch (e) {
        setLoadingStatus(false)
      }
    }
    const beforeRead = (file: any) => {
      if (!state.category) {
        Toast({ message: '请选择薪酬证明类型后再进行图片上传' })
        return false
      } else if (!state.jobName) {
        Toast({ message: '请选择岗位后再进行图片上传' })
        return false
      } else {
        return true
      }
    }
    const beforeDelete = (file: any, detail: any) => {
      const index: number = detail.index
      state.fileList.splice(index, 1)
      const photoId = state.photoId
      const photoIdArr = photoId.split(',')
      photoIdArr.splice(index, 1)
      state.photoId = photoIdArr.join(',')
      return true
    }
    const onConfirm = (val: string) => {
      state.category = val
      state.showPicker = false
    }
    const getExamineDetail = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { id: router.currentRoute.value.query.id || '', degree: router.currentRoute.value.query.degree || '' }
      const res = (await CommonServer.getExamineDetail(data)) || []
      setLoadingStatus(false)
      console.log(res)
      state.tableList = []
      state.id = res.id || ''
      state.companyName = res.name || ''
      state.degree = res.degree || ''
      if (res.jobs) {
        const jobsData = JSON.parse(JSON.stringify(res.jobs))
        jobsData.forEach((item: any, index: number) => {
          item.seq = index + 1
          state.tableList.push(item)
        })
      }
    }
    onMounted(() => {
      getExamineDetail()
      explain()
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      getExamineDetail,
      onConfirm,
      afterRead,
      beforeDelete,
      submitPromise,
      beforeRead,
      explain,
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

.table {
  width: 100%;
  color: #333;
  font-size: 14px;
  text-align: center;
  border: 1px solid #ececec;
  border-collapse: collapse;

  thead {
    background-color: #f3f3f3;
  }

  td {
    padding: 2px;
    line-height: 1.5;
    word-break: break-all;

    .van-cell {
      height: 20px;
      padding: 0;
      // font-size: 12px;
      // line-height: 30px;

      * {
        // font-size: 16px;
      }
    }
  }

  th,
  td {
    padding: 10px;
    border-top: 1px solid #ececec;
    border-right: 1px solid #ececec;

    &:last-child {
      border-right: none;
    }
  }

  td {
    padding: 3px;

    div {
      padding-bottom: 0;
      // font-size: 16px;
      // line-height: 35px;
    }
  }

  tbody > tr:last-child {
    border-bottom: 1px solid #ececec;
  }
}
</style>

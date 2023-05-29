<template>
  <div class="container-view">
    <div class="box-view">
      <!-- <van-form>
        <van-cell-group v-for="(item, index) in tableList" :key="index" inset style="margin-bottom: 10px;">
          <van-field v-model="item.name" name="单位" label="单位" readonly />
          <van-field v-model="item.jobName" name="招聘岗位" label="招聘岗位" readonly />
          <van-field v-model="item.degree" name="学历" label="学历" readonly />
          <van-field v-model="item.commitUser" name="提交人" label="提交人" readonly />
          <van-field v-model="item.CommitDate" name="提交时间" label="提交时间" readonly />
          <van-field v-model="item.checkStatus" name="审核结果" label="审核结果" readonly />
          <div>
            <van-button style="width: 100%;" type="primary" @click="imgPreview(item)">图片查阅</van-button>
          </div>
        </van-cell-group>
      </van-form> -->
      <div>
        <table class="table">
          <colgroup>
            <col />
            <col style="width: 17%;" />
            <col style="width: 25%;" />
            <col style="width: 18%;" />
            <col style="width: 15%;" />
          </colgroup>
          <thead>
            <tr>
              <th>招聘岗位</th>
              <th>学历</th>
              <th>提交时间</th>
              <th>审核结果</th>
              <th>查阅</th>
            </tr>
          </thead>
        </table>
        <table class="table" style="margin-bottom: 10px;">
          <colgroup>
            <col />
            <col style="width: 17%;" />
            <col style="width: 25%;" />
            <col style="width: 18%;" />
            <col style="width: 15%;" />
          </colgroup>
          <tbody>
            <template v-if="tableList.length > 0">
              <tr v-for="(item, index) in tableList || []" :key="index">
                <template v-if="item.titleName">
                  <td style="padding-left: 5px; font-weight: bold; text-align: left;" colspan="5">
                    {{ item.titleName }}
                  </td>
                </template>
                <template v-else>
                  <td>{{ item.jobName }}</td>
                  <td>{{ item.degree }}</td>
                  <td>{{ item.CommitDate }}</td>
                  <td>{{ item.checkStatus }}</td>
                  <td>
                    <van-icon name="search" @click="imgPreview(item)" />
                  </td>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td style="padding: 20px;" colspan="5">
                  <span>暂无数据...</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="foot-button">
      <van-button style="width: 50%;" type="primary" @click="explain">说明</van-button>
      <van-button style="width: 50%;" color="#F69C00" @click="$router.go(-1)">返回</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import CommonServer from '@/api/common'
import { dateFormat, setLoadingStatus } from '@/utils/index'
import { Toast, Dialog, ImagePreview } from 'vant'

export default defineComponent({
  name: 'landing',
  setup() {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)
    const loadingObj = computed(() => store.state.loadingObj)
    type tableItem = {
      index: any
      name: string
      jobName: string
      degree: string
      commitUser: string
      CommitDate: string
      checkStatus: any
      titleName: string
    }
    type urlItem = string
    const state = reactive({
      loadingObj,
      loginStatus,
      accessToken,
      userInfo,
      tableList: [] as tableItem[],
      url: [] as urlItem[],
      fileList: [],
    })
    const explain = () => {
      Dialog.alert({
        title: '说明',
        messageAlign: 'left',
        message: '当您填报审核不通过再次填报时，不能填报成功，说明其他同学已填报或已审核，未审状态时其他同学不能填报。',
      }).then(() => {
        // on close
      })
    }
    const imgPreview = async (item: any) => {
      setLoadingStatus(true, '正在查询图片信息...')
      const id = item.id
      const res = (await CommonServer.getExaminePhoto(id)) || []
      setLoadingStatus(false)
      if (res.files) {
        state.url = []
        if (!(res.files instanceof Array)) {
          state.url.push(res.files)
        } else {
          if (res.files.length > 0) {
            for (const oneFile of res.files) {
              state.url.push(oneFile.fileUrl)
            }
          }
        }
        ImagePreview(state.url)
      } else {
        Toast({ message: '暂无图片信息' })
      }
    }
    const getExamineDetail = async () => {
      setLoadingStatus(true, '正在查询...')
      const userName = state.userInfo.ambName
      // const userName = '刘达泰'
      const res = (await CommonServer.getExamineOne(userName)) || []
      setLoadingStatus(false)
      state.tableList = []
      const data = JSON.parse(JSON.stringify(res))
      if (data) {
        let saveName = ''
        data.forEach((item: any, index: number) => {
          const titleArr = {
            index: '',
            name: item.name,
            titleName: item.name,
            jobName: '',
            degree: '',
            commitUser: '',
            CommitDate: '',
            checkStatus: '',
          }
          if (state.tableList.length === 0 || saveName !== item.name) {
            saveName = item.name
            state.tableList.push(titleArr)
            state.tableList.push(item)
          } else if (saveName === item.name) {
            state.tableList.push(item)
          }
        })
        console.log(state.tableList)
      }
      // state.tableList = res || []
    }
    onMounted(() => {
      getExamineDetail()
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      getExamineDetail,
      imgPreview,
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
  margin-bottom: calc(constant(safe-area-inset-bottom) + 60px);
  margin-bottom: calc(env(safe-area-inset-bottom) + 60px);
  // iphone 刘海屏优化
  padding: 0 10px;
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
  // font-size: 16px;
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

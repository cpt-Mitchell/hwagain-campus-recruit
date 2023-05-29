<template>
  <div class="container-view">
    <div class="box-view">
      <!-- <van-row style="line-height: 50px;">
        <van-col span="12">
          <span>收集人：{{ userInfo.ambName }}</span>
        </van-col>
        <van-col span="12" align="right">
          <span>学校：{{ userInfo.universityName }}</span>
        </van-col>
      </van-row> -->
      <div>
        <table class="table">
          <colgroup>
            <col style="width: 20%;" />
            <col />
            <col style="width: 20%;" />
            <col style="width: 20%;" />
          </colgroup>
          <thead>
            <tr>
              <th>序号</th>
              <th>招聘岗位</th>
              <th>本科</th>
              <th>硕士</th>
            </tr>
          </thead>
        </table>
        <table class="table">
          <colgroup>
            <col style="width: 20%;" />
            <col />
            <col style="width: 20%;" />
            <col style="width: 20%;" />
          </colgroup>
          <tbody>
            <template v-if="tableList.length > 0">
              <tr v-for="(item, index) in tableList || []" :key="index">
                <template v-if="item.companyTitle">
                  <td :rowspan="item.rowspan">{{ item.seq }}</td>
                  <td style="padding-left: 5px; font-weight: bold; text-align: left;" colspan="3">
                    {{ item.companyTitle }}
                  </td>
                </template>
                <template v-else>
                  <td>{{ item.jobName }}</td>
                  <td v-if="item.isFirst" :rowspan="item.rowspan">
                    <van-button v-if="!item.hasBData" type="primary" size="small" @click="goOne(item, '本科')">待收集去填报</van-button>
                    <span v-else>已收集</span>
                  </td>
                  <td v-if="item.isFirst" :rowspan="item.rowspan">
                    <van-button v-if="!item.hasMData" type="primary" size="small" @click="goOne(item, '硕士')">待收集去填报</van-button>
                    <span v-else>已收集</span>
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
import { setLoadingStatus } from '@/utils/index'
import { Dialog } from 'vant'

export default defineComponent({
  name: 'landing',
  setup() {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)
    type tableItem = {
      seq: string
      companyTitle: string
      jobName: string
      name: string
      id: any
      isFirst: boolean
      rowspan: any
      hasBData: boolean
      hasMData: boolean
    }
    const state = reactive({
      loginStatus,
      accessToken,
      userInfo,
      tableList: [] as tableItem[],
    })
    const explain = () => {
      Dialog.alert({
        title: '收集说明',
        messageAlign: 'left',
        message:
          '一、证明提供方式及要求：\n1、薪资证明类型：\n（1）纸质录取通知书；\n（2）电子邮件录取通知书；\n2、薪资证明类型提供信息要求：\n（1）纸质录取通知书：\n①信息：薪酬信息、招聘单位信息及戳章\n②提供方式：拍照\n（2）电子邮件录取通知书：\n①信息：薪酬信息、招聘单位邮箱地址、招聘单位\n②提供方式：截图\n（3）录取通知书要求全版面拍照或截图。\n3、信息处理：\n（1）处理内容：薪资证明上的学生姓名及手机号码。\n（2）处理方法：通过马赛克打码处理。\n二、操作说明：\n1、被录用人的招聘单位及岗位需同调查的单位及岗位一致。\n2、名词说明：\n（1）待收集去填报：指的是没有收集完成，可以点击去填报。\n（2）已收集：指的是薪资信息已收集完成。\n（3）填报选择：本科或硕士需分别点击填报。',
      }).then(() => {
        // on close
      })
    }
    const getList = async () => {
      setLoadingStatus(true, '正在查询...')
      // const userName = '刘达泰'
      const userName = state.userInfo.ambName
      const res = (await CommonServer.getExamineList(userName)) || []
      setLoadingStatus(false)
      console.log(res)
      if (res.length > 0) {
        state.tableList = []
        const data = JSON.parse(JSON.stringify(res))
        let seq = 0
        data.forEach((item: any) => {
          seq++
          const titleArr = {
            seq: seq.toString(),
            companyTitle: item.name,
            jobName: '',
            name: item.name,
            id: '',
            isFirst: false,
            rowspan: item.jobs.length + 1,
            hasBData: false,
            hasMData: false,
          }
          state.tableList.push(titleArr)
          item.jobs.forEach((val: any, idx: number) => {
            const bodyArr = {
              seq: seq.toString(),
              companyTitle: '',
              jobName: val.jobName,
              name: item.name,
              id: item.id,
              isFirst: idx === 0,
              rowspan: item.jobs.length,
              hasBData: item.hasBData,
              hasMData: item.hasMData,
            }
            state.tableList.push(bodyArr)
          })
          console.log(state.tableList)
        })
      }
    }
    const goOne = (item: any, type: string) => {
      router.push({
        path: '/examineDetail',
        query: {
          id: item.id,
          degree: type,
        },
      })
    }
    onMounted(() => {
      getList()
      explain()
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      goOne,
      getList,
      explain,
      // setLoginStatus
    }
  },
})
</script>

<style lang="less" scoped>
.container-view {
  // height: 100vh;
  background: #f7f8fa;
}

.box-view {
  margin-bottom: calc(constant(safe-area-inset-bottom) + 60px);
  margin-bottom: calc(env(safe-area-inset-bottom) + 60px);
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

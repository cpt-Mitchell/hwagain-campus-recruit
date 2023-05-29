<template>
  <div class="container-view">
    <div class="box-view">
      <van-row style="line-height: 50px;">
        <van-col span="12">
          <span>收集人：{{ userInfo.ambName }}</span>
        </van-col>
        <van-col span="12" align="right">
          <span>学校：{{ userInfo.universityName }}</span>
        </van-col>
      </van-row>
      <div>
        <table class="table">
          <colgroup>
            <col />
            <col style="width: 15%;" />
            <col style="width: 22%;" />
            <col style="width: 20%;" />
            <col style="width: 15%;" />
          </colgroup>
          <thead>
            <tr>
              <th>群名称</th>
              <th>发布次序</th>
              <th>发布时间</th>
              <th>状态</th>
              <th>详细信息</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="tableList.length > 0">
              <tr v-for="(item, index) in tableList || []" :key="index">
                <template v-if="item.schoolTitle">
                  <td style="padding-left: 5px; font-weight: bold; text-align: left;" colspan="5">
                    {{ item.schoolTitle }}
                  </td>
                </template>
                <template v-else>
                  <td>{{ item.groupName }}</td>
                  <td>{{ item.seq }}</td>
                  <td>
                    {{ item.publishDate ? item.publishDate.substring(5, 10) : '' }}
                  </td>
                  <td>{{ item.checkStatus }}</td>
                  <td>
                    <van-icon :data-item="item" @click="goOne(item)" name="search" />
                  </td>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="5">
                  <span>暂无数据...</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
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
    type tableItem = {
      schoolTitle: string
      ambPlanambassid: string
      checkStatus: string
      publishDate: string
      enterpriseName: string
      id: string
      groupName: string
      seq: string
    }
    const state = reactive({
      loginStatus,
      accessToken,
      userInfo,
      tableList: [] as tableItem[]
    })

    const getList = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { ambassId: state.userInfo.id }
      const res = (await CommonServer.getSendMsgList(data)) || []
      setLoadingStatus(false)
      if (res.length > 0) {
        state.tableList = []
        res.forEach((item: any, index: number) => {
          const titleArr = {
            schoolTitle: '',
            ambPlanambassid: '',
            checkStatus: '',
            publishDate: '',
            enterpriseName: '',
            id: '',
            groupName: '',
            seq: ''
          }
          titleArr.seq = (index + 1).toString()
          titleArr.schoolTitle = titleArr.seq + '、' + item.name
          state.tableList.push(titleArr)
          if (item.list.length > 0) {
            item.list.forEach((val: any, idx: number) => {
              val.seq = (idx + 1).toString()
              val.schoolTitle = ''
              state.tableList.push(val)
            })
          }
        })
      }
    }
    const goOne = (item: any) => {
      if (item.checkStatus === '未提交' || item.checkStatus === '审核中') {
        router.push({
          path: '/sendMsgInput',
          query: {
            id: item.id,
            checkStatus: item.checkStatus || ''
          }
        })
      } else {
        router.push({
          path: '/sendMsgDetail',
          query: {
            id: item.id,
            collegeName: item.collegeName
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
      goOne,
      getList
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
  padding: 0 15px;
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

      * {
        // font-size: 16px;
      }
    }
  }

  th,
  td {
    padding: 3px;
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
    }
  }

  tbody > tr:last-child {
    border-bottom: 1px solid #ececec;
  }
}
</style>

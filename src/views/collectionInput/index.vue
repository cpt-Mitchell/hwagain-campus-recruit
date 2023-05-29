<template>
  <div class="container-view">
    <div class="box-view">
      <van-form>
        <van-cell-group inset style="margin: 20px 20px 0;">
          <van-row class="title-row">
            <van-col span="12">
              <span>收集人：{{ userInfo.ambName }}</span>
            </van-col>
            <van-col span="12" align="right">
              <span>学校：{{ userInfo.universityName }}</span>
            </van-col>
          </van-row>
        </van-cell-group>
        <van-row class="title-row">
          <van-col span="24">
            <span style="font-weight: bold;">单位信息</span>
          </van-col>
        </van-row>
        <van-cell-group inset>
          <!-- <van-field v-model="form.enterpriseName" name="企业名称" label="企业名称" placeholder="请录入">
            <template #input>
              <van-dropdown-menu class="" id="rank" active-color="#1989fa">
                <van-dropdown-item v-model="form.enterpriseName" :options="nameList" />
              </van-dropdown-menu>
            </template>
          </van-field> -->
          <van-field v-model="form.enterpriseName" autocomplete="on" name="企业名称" label="企业名称" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]" />
          <van-field v-model="form.belongType" is-link readonly label="所属行业" placeholder="点击选择" @click="showPicker = true" />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
          </van-popup>
        </van-cell-group>
        <van-row class="title-row">
          <van-col span="24">
            <span style="font-weight: bold;">岗位信息</span>
          </van-col>
        </van-row>
        <van-cell-group inset>
          <van-field v-model="form.jobName" name="招聘岗位" label="招聘岗位" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]" />
          <van-field v-model="form.workplace" name="工作地点" label="工作地点" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]" />
          <van-field v-model="form.majorName" name="专业" label="专业" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]" />
          <van-field :placeholder="form.isMore ? '' : '请录入'" v-model="form.num" maxlength="3" type="number" name="招聘人数" label="招聘人数" :readonly="form.isMore">
            <template #extra>
              <span v-if="!form.isMore">人，</span>
              <van-checkbox label-position="left" v-model="form.isMore" shape="square" @click="changeIsMore"> 若干 </van-checkbox>
              <div :style="form.isMore ? 'width: 50%;' : 'width: 25%;'"></div>
            </template>
          </van-field>
          <van-field name="学历" label="学历">
            <template #input>
              <van-checkbox-group v-model="form.degreeArr" @change="changeDegree" direction="horizontal">
                <van-checkbox shape="square" name="本科">本科</van-checkbox>
                <van-checkbox shape="square" name="硕士">硕士</van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field>
        </van-cell-group>
        <van-row v-if="showB || showM" class="title-row">
          <van-col span="24">
            <span style="font-weight: bold;">薪酬信息</span>
          </van-col>
        </van-row>
        <van-cell-group inset>
          <template v-if="showB">
            <van-row>
              <van-col class="box-title" span="24">
                <span>本科</span>
              </van-col>
            </van-row>
            <van-field name="月薪(元)" label="月薪(元)">
              <template #input>
                <input class="field-input" @input="changeB" v-model="form.bminSalary" type="number" placeholder="请录入" />
                <span style="margin: 0 5px;">-</span>
                <input class="field-input" @input="changeB" v-model="form.bmaxSalary" type="number" placeholder="请录入" />
              </template>
            </van-field>
            <van-field v-model="form.bsystem" @input="changeB" type="number" name="薪制" label="薪制" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]">
              <template #extra>
                <span>薪</span>
                <div style="width: 30%;"></div>
              </template>
            </van-field>
            <van-field v-model="form.byearSalary" :readonly="true" name="年薪(万元)" label="年薪(万元)" placeholder="自动计算" />
          </template>
          <template v-if="showM">
            <van-row>
              <van-col class="box-title" span="24">
                <span>硕士</span>
              </van-col>
            </van-row>
            <van-field name="月薪(元)" label="月薪(元)">
              <template #input>
                <input class="field-input" @input="changeM" v-model="form.mminSalary" type="number" placeholder="请录入" />
                <span style="margin: 0 5px;">-</span>
                <input class="field-input" @input="changeM" v-model="form.mmaxSalary" type="number" placeholder="请录入" />
              </template>
            </van-field>
            <van-field v-model="form.msystem" @input="changeM" type="number" name="薪制" label="薪制" placeholder="请录入" :rules="[{ required: true, message: '请录入' }]">
              <template #extra>
                <span>薪</span>
                <div style="width: 30%;"></div>
              </template>
            </van-field>
            <van-field v-model="form.myearSalary" :readonly="true" name="年薪(万元)" label="年薪(万元)" placeholder="自动计算" />
          </template>
        </van-cell-group>
        <van-cell-group style="margin-top: 15px;" inset>
          <van-field v-model="form.structDesc" type="textarea" :row="2" autosize name="薪酬结构说明" label="薪酬结构说明" placeholder="请录入（如年终奖发放方式、绩效工资计发方式等）" />
          <van-field v-model="form.treatment" type="textarea" :row="2" autosize name="福利待遇" label="福利待遇" placeholder="请录入（如五险一金、补贴等）" />
          <van-field name="uploader" label="材料上传（拍照、截图等）">
            <template #input>
              <van-uploader :before-delete="beforeDelete" preview-size="62" :after-read="afterRead" v-model="url" multiple />
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </div>
    <div class="foot-button" v-if="checkStatus === '不通过'">
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
import { Toast, Dialog } from 'vant'
import { setLoadingStatus } from '@/utils/index'

export default defineComponent({
  name: 'landing',
  setup() {
    const store = useStore()

    const loginStatus = computed(() => store.getters.loginStatus)
    const accessToken = computed(() => store.getters.accessToken)
    const userInfo = computed(() => store.getters.userInfo)
    // const nameList = computed(() => store.getters.nameList)
    type tableItem = {
      fileUrl: string
      fileName: string
    }
    type urlItem = {
      url: string
    }
    type nameItem = {
      text: string
      value: string
    }
    type degreeItem = any
    type columnsItem = any
    const query = router.currentRoute.value.query
    const state = reactive({
      loginStatus,
      accessToken,
      userInfo,
      checkStatus: query.checkStatus || '',
      nameList: [] as nameItem[],
      showPicker: false,
      columns: [] as columnsItem[],
      url: [] as urlItem[],
      showB: false,
      showM: false,
      form: {
        id: '',
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
      },
    })

    /* function setLoginStatus (loginStatus: number) {
        store.dispatch('setLoginStatus', loginStatus)
      } */
    const back = () => {
      router.go(-1)
    }
    const changeDegree = () => {
      if (state.form.degreeArr.indexOf('本科') !== -1) {
        state.showB = true
      } else {
        state.showB = false
        state.form.bminSalary = ''
        state.form.bmaxSalary = ''
        state.form.bsystem = ''
        state.form.byearSalary = ''
      }
      if (state.form.degreeArr.indexOf('硕士') !== -1) {
        state.showM = true
      } else {
        state.showM = false
        state.form.mminSalary = ''
        state.form.mmaxSalary = ''
        state.form.msystem = ''
        state.form.myearSalary = ''
      }
    }
    const changeB = () => {
      if (state.form.bminSalary && state.form.bmaxSalary && state.form.bsystem) {
        if (state.form.bminSalary !== state.form.bmaxSalary) {
          state.form.byearSalary = ((Number(state.form.bminSalary) * Number(state.form.bsystem)) / 10000).toFixed(1).toString() + '-' + ((Number(state.form.bmaxSalary) * Number(state.form.bsystem)) / 10000).toFixed(1).toString()
        } else {
          state.form.byearSalary = ((Number(state.form.bminSalary) * Number(state.form.bsystem)) / 10000).toFixed(1).toString()
        }
      } else {
        state.form.byearSalary = ''
      }
    }
    const changeM = () => {
      if (state.form.mminSalary && state.form.mmaxSalary && state.form.msystem) {
        if (state.form.mminSalary !== state.form.mmaxSalary) {
          state.form.myearSalary = ((Number(state.form.mminSalary) * Number(state.form.msystem)) / 10000).toFixed(1).toString() + '-' + ((Number(state.form.mmaxSalary) * Number(state.form.msystem)) / 10000).toFixed(1).toString()
        } else {
          state.form.myearSalary = ((Number(state.form.mminSalary) * Number(state.form.msystem)) / 10000).toFixed(1).toString()
        }
      } else {
        state.form.myearSalary = ''
      }
    }
    const save = async () => {
      if (state.form.enterpriseName && state.form.belongType) {
        setLoadingStatus(true, '正在保存...')
        if (!state.form.ambPlanambassid) {
          state.form.ambPlanambassid = state.userInfo.id
        }
        if (state.form.isMore) {
          state.form.num = '若干'
        }
        if (state.form.fileList.length > 0) {
          state.form.fileList.forEach((item: any, index: number) => {
            if (!item.fileName && !item.fileUrl) {
              state.form.fileList.splice(index, 1)
            }
          })
        }
        state.form.degree = state.form.degreeArr.join(',')
        state.form.status = 10
        const data = state.form
        const res = await CommonServer.confirmCollection(data)
        setLoadingStatus(false)
        if (res) {
          Toast({ message: res })
        }
        if (res === '保存成功') {
          router.go(-1)
        }
      } else {
        Toast({ message: '请至少录入企业名称和所属行业后再进行暂存' })
      }
    }
    const confirm = () => {
      if (state.form.fileList.length > 0) {
        if (state.form.enterpriseName && state.form.belongType && state.form.jobName && state.form.workplace && state.form.majorName && (state.form.num || state.form.isMore) && state.form.degreeArr) {
          if (state.form.degreeArr.indexOf('本科') !== -1 && state.form.degreeArr.indexOf('硕士') !== -1) {
            if (state.form.bminSalary && state.form.bmaxSalary && state.form.bsystem && state.form.byearSalary && state.form.mminSalary && state.form.mmaxSalary && state.form.msystem && state.form.myearSalary) {
              submit()
            } else {
              Toast({ message: '请检查是否录入完整再进行提交' })
              return false
            }
          } else if (state.form.degreeArr.indexOf('本科') !== -1) {
            if (state.form.bminSalary && state.form.bmaxSalary && state.form.bsystem && state.form.byearSalary) {
              submit()
            } else {
              Toast({ message: '请检查是否录入完整再进行提交' })
              return false
            }
          } else if (state.form.degreeArr.indexOf('硕士') !== -1) {
            if (state.form.mminSalary && state.form.mmaxSalary && state.form.msystem && state.form.myearSalary) {
              submit()
            } else {
              Toast({ message: '请检查是否录入完整再进行提交' })
              return false
            }
          }
        } else {
          Toast({ message: '请检查是否录入完整再进行提交' })
        }
      } else {
        Toast({ message: '请上传材料（拍照、截图等）后在进行提交' })
      }
    }
    const submit = async () => {
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
      if (!state.form.ambPlanambassid) {
        state.form.ambPlanambassid = state.userInfo.id
      }
      if (state.form.isMore) {
        state.form.num = '若干'
      }
      if (state.form.fileList.length > 0) {
        state.form.fileList.forEach((item: any, index: number) => {
          if (!item.fileName && !item.fileUrl) {
            state.form.fileList.splice(index, 1)
          }
        })
      }
      state.form.degree = state.form.degreeArr.join(',')
      state.form.status = 20
      const data = state.form
      const res = (await CommonServer.confirmCollection(data)) || []
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
        const res = (await CommonServer.uploadFiles(formData)) || []
        setLoadingStatus(false)
        if (res) {
          res.forEach((item: any) => {
            const arr = { fileName: item.fileName, fileUrl: item.filePath, fileId: item.fileId }
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
    const onConfirm = (val: string) => {
      state.form.belongType = val
      state.showPicker = false
    }
    const getBelongType = async () => {
      const data = { typeName: 'belongType' }
      const res = (await CommonServer.getBelongType(data)) || []
      setLoadingStatus(false)
      if (res.length > 0) {
        const columns: any[] = []
        res.forEach((item: any) => {
          columns.push(item.itemName)
        })
        state.columns = columns
      }
    }
    const changeIsMore = () => {
      state.form.num = ''
    }
    const getNameList = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { ambassId: state.userInfo.id }
      const res = (await CommonServer.getCollectionList(data)) || []
      if (res.length > 0) {
        state.nameList = []
        res.forEach((item: any) => {
          const oneArr = { text: '', value: '' }
          if (item.name) {
            oneArr.text = item.name
            oneArr.value = item.name
            state.nameList.push(oneArr)
          }
        })
      }
    }
    const getList = async () => {
      setLoadingStatus(true, '正在查询...')
      const data = { id: router.currentRoute.value.query.id }
      const res = (await CommonServer.getOneCollectionDetail(data)) || []
      setLoadingStatus(false)
      state.form = res
      if (state.form.num === '若干') {
        state.form.isMore = true
        state.form.num = ''
      }
      if (state.form.degree) {
        state.form.degreeArr = state.form.degree.split(',')
      }
      if (state.form.fileList.length > 0) {
        state.form.fileList.forEach((item: any) => {
          if (item.fileName && item.fileUrl) {
            const arr = { url: item.fileUrl }
            state.url.push(arr)
          }
        })
      }
    }
    onMounted(() => {
      getNameList()
      getBelongType()
      if (router.currentRoute.value.query.id) {
        getList()
      }
    })
    return {
      ...toRefs(state),
      loginStatus,
      accessToken,
      userInfo,
      changeIsMore,
      getBelongType,
      onConfirm,
      afterRead,
      confirm,
      save,
      changeB,
      changeM,
      getList,
      changeDegree,
      submit,
      back,
      getNameList,
      submitPromise,
      beforeDelete,
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
  width: 40px;
  border: none;
}
</style>

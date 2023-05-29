import * as types from './mutationTypes'
import type { State, UserInfo, NameList, LoadingObj } from '@/types'

const mutations = {
  [types.SET_LOGIN_STATUS] (state: State, loginStatus: number): void {
    state.loginStatus = loginStatus
  },
  [types.SET_ACCESS_TOKEN] (state: State, accessToken: string): void {
    state.accessToken = accessToken
  },
  [types.SET_USER_INFO] (state: State, userInfo: UserInfo): void {
    state.userInfo = userInfo
  },
  [types.SET_NAME_LIST] (state: State, nameList: NameList): void {
    state.nameList = nameList
  },
  [types.SET_LOADING] (state: State, loadingObj: LoadingObj): void {
    state.loadingObj = { isLoading: loadingObj.isLoading, loadingText: loadingObj.loadingText }
  }
}

export default mutations

import { Commit } from 'vuex'

export interface UserInfo {
  username: string,
  openid: string
}
export interface NameList {
  text: string,
  value: string
}

export interface LoadingObj {
  isLoading: boolean,
  loadingText: string
}

export interface State {
  loadingObj: LoadingObj,
  loginStatus: number,
  accessToken: string | undefined,
  userInfo: UserInfo,
  nameList: NameList
}

export interface CommitFunction {
  commit: Commit
}

export interface CommitStateFunction extends CommitFunction {
  state: State
}

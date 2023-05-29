import { loadCookie, loadStorage } from '@/utils/cache'
import { ACCESS_TOKEN, LOGIN_STATUS, USER_INFO, NAME_LIST } from '@/utils/constants'
import type { State, UserInfo, NameList } from '@/types'

const state: State = {
  loginStatus: Number(loadCookie(LOGIN_STATUS, '0')),
  accessToken: loadStorage(ACCESS_TOKEN, ''),
  userInfo: loadStorage(USER_INFO, { username: '' }) as UserInfo,
  nameList: loadStorage(NAME_LIST, { text: '', value: '' }) as NameList,
  loadingObj: { isLoading: false, loadingText: '' }
}

export default state

import { parse, stringify } from 'qs'
import router from '@/router'
import store from '@/store'
import CommonServer from '@/api/common'
import vueWechatAuth from '@/plugins/vueWechatAuth'
import { setLoadingStatus } from '@/utils'

router.beforeEach(async (to, from, next) => {
  let { loginStatus } = store.getters
  loginStatus = Number(loginStatus)
  if (loginStatus === 0) {
    vueWechatAuth.redirectUri = processUrl()
    await store.dispatch('setLoginStatus', 1)
    window.location.href = vueWechatAuth.authUrl
  } else if (loginStatus === 1) {
    try {
      vueWechatAuth.returnFromWechat(to.fullPath)
      // next()
      const result = await processLogin(vueWechatAuth.code)
      if (result.status === 2) {
        next('/landing')
      } else {
        next()
      }
    } catch (err) {
      await store.dispatch('setLoginStatus', 0)
      next()
    }
  } else if (loginStatus === 3 || (to.path === '/landing' && loginStatus !== 3)) {
    next()
  } else if (loginStatus === 2) {
    next('/landing')
  }
})

router.afterEach((to, form, next) => {
  setLoadingStatus(false)
  document.title = to.meta.title as string
})

/**
 * 处理url链接
 */
function processUrl (): string {
  const url = window.location.href
  // 解决多次登录url添加重复的code与state问题
  const params = parse(url.split('?')[1])
  let redirectUrl = url
  if (params.code && params.state) {
    delete params.code
    delete params.state
    const query = stringify(params)
    if (query.length) {
      redirectUrl = `${url.split('?')[0]}?${query}`
    } else {
      redirectUrl = `${url.split('?')[0]}`
    }
  }
  return redirectUrl
}

/**
 * 处理登录
 * @param code
 */
function processLogin (code: string): Promise<any> {
  const data = { code }
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const res = await CommonServer.login(data)
      await store.dispatch('setLoginStatus', res.registerStatus === '未注册' ? 2 : 3)
      if (res.registerStatus === '未注册') {
        await store.dispatch('setUserInfo', res.codeResult)
      } else {
        const { PlanAmbass, ambassToken } = res
        await store.dispatch('setAccessToken', ambassToken)
        await store.dispatch('setUserInfo', PlanAmbass)
      }
      resolve({ status: res.registerStatus === '未注册' ? 2 : 3, data: '登录成功' })
    } catch (err) {
      reject(err)
    }
  })
}

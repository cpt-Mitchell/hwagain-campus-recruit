import request from '@/utils/request'
import type { LoginReq, LoginResp, sendMsg, sendMsgResp, queryPI, LandingInfo, collectionList, belongType, oneCollectionDetail, confirmCollection, sendMsgList, getCollege, confirmSendMsg, sendMsgListOne, getExamineDetail, confirmExamineDetail } from '@/types/api'
import { UserInfo } from '@/types'

export default class CommonServer {
  // 登录接口
  static login (data: LoginReq): Promise<{registerStatus: string, codeResult: any, PlanAmbass: any, ambassToken: string}> {
    return request.request({
      url: 'ambass/planAmbass/oauth2_access_token',
      method: 'get',
      params: data
    })
  }

  static sendMsg (data: sendMsg): Promise<any> {
    return request.request({
      url: 'ambass/planAmbass/sendMessage',
      method: 'get',
      params: data
    })
  }

  static queryPersonalInfo (data: queryPI): Promise<any> {
    return request.request({
      url: 'ambass/planAmbass/findOne',
      method: 'get',
      params: data
    })
  }

  static confirmLanding (data: LandingInfo): Promise<any> {
    return request.request({
      url: 'ambass/planAmbass/updateRegister',
      method: 'get',
      params: data
    })
  }

  static getCollectionList (data: collectionList): Promise<any> {
    return request.request({
      url: 'recruitSalary/recruitsalary/findList',
      method: 'get',
      params: data
    })
  }

  static getBelongType (data: belongType): Promise<any> {
    return request.request({
      url: 'base/dictData/list',
      method: 'get',
      params: data
    })
  }

  static uploadFiles (data: any): Promise<any> {
    return request.request({
      url: 'recruitSalary/recruitsalary/mutipleUpload',
      method: 'post',
      data,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  static getOneCollectionDetail (data: oneCollectionDetail): Promise<any> {
    return request.request({
      url: 'recruitSalary/recruitsalary/findOne',
      method: 'get',
      params: data
    })
  }

  static confirmCollection (data: confirmCollection): Promise<any> {
    return request.request({
      url: 'recruitSalary/recruitsalary/save',
      method: 'post',
      data
    })
  }

  static getSendMsgList (data: sendMsgList): Promise<any> {
    return request.request({
      url: 'recruitSalary/cutimage/findList',
      method: 'get',
      params: data
    })
  }

  static getCollege (data: getCollege): Promise<any> {
    return request.request({
      url: 'ambass/planAmbass/findCollegeList',
      method: 'get',
      params: data
    })
  }

  static confirmSendMsg (data: confirmSendMsg): Promise<any> {
    return request.request({
      url: 'recruitSalary/cutimage/addOrUpdate',
      method: 'post',
      data
    })
  }

  static getOneSendMsgDetail (data: sendMsgListOne): Promise<any> {
    return request.request({
      url: 'recruitSalary/cutimage/findOne',
      method: 'get',
      params: data
    })
  }

  static getMajorList (ambassId: string): Promise<any> {
    return request.request({
      url: 'ambass/planAmbass/findMajorList',
      method: 'get',
      params: { ambassId }
    })
  }

  static getExamineList (userName: any): Promise<any> {
    return request.request({
      url: 'salary/phone/list',
      method: 'get',
      params: { userName }
    })
  }

  static getExamineDetail (data: getExamineDetail): Promise<any> {
    return request.request({
      url: 'salary/phone/fill/surface',
      method: 'get',
      params: data
    })
  }

  static confirmExamineDetail (data: confirmExamineDetail): Promise<any> {
    return request.request({
      url: 'salary/phone/fill/submit',
      method: 'get',
      params: data
    })
  }

  static getExamineOne (userName: string): Promise<any> {
    return request.request({
      url: 'salary/phone/status/list',
      method: 'get',
      params: {
        userName: userName
      }
    })
  }
  
  static getExaminePhoto (id: string): Promise<any> {
    return request.request({
      url: 'salary/audit/surface',
      method: 'get',
      params: {
        id: id
      }
    })
  }
}

import type { UserInfo } from '@/types/index'

export interface LoginReq {
  code: string
}

export interface LoginResp {
  accessToken: string,
  userInfo: any,
  PlanAmbass: any,
  ambassToken: string
}

export interface sendMsg {
  mobile: string
}

export interface sendMsgResp {
  data: string
}

export interface queryPI {
  ambMobile: string,
  checkCode: string
}

export interface LandingInfo {
  id: string,
  openid: string
}

export interface collectionList {
  ambassId: string
}

export interface sendMsgList {
  ambassId: string
}

export interface getCollege {
  ambassId: string
}

export interface belongType {
  typeName: string
}

export interface oneCollectionDetail {
  id: any
}

export interface sendMsgListOne {
  id: any
}

export interface confirmCollection {
  id: any,
  ambPlanambassid: string,
  enterpriseName: string,
  belongType: string,
  jobName: string,
  workplace: string,
  majorName: string,
  num: string,
  isMore: any,
  degreeArr: any,
  degree: string,
  bminSalary: any,
  bmaxSalary: any,
  bsystem: any,
  byearSalary: string,
  mminSalary: any,
  mmaxSalary: any,
  msystem: any,
  myearSalary: string,
  structDesc: string,
  treatment: string,
  fileList: any,
  status: any
}

export interface confirmSendMsg {
  id: any,
  ambPlanambassid: string,
  collegeName: string,
  collegeID: string,
  publishDate: string,
  groupName: string,
  groupType: string,
  count: string,
  status: any,
  fileList: any,
  groupDegree: string
}

export interface getExamineDetail {
  id: any,
  degree: any
}

export interface confirmExamineDetail {
  id: any,
  degree: string,
  jobName: string,
  category: string,
  photoId: any,
  userName: string
}

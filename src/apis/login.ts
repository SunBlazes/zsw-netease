import { AxiosResponse } from "axios"
import request from "."
import { UserAccountAPIType } from "./user"

interface PhoneCodeType {
  code: number
  data: boolean
}
export function getPhoneCaptcha(
  phone: string = "18257712408"
): Promise<AxiosResponse<PhoneCodeType>> {
  return request.get(`/captcha/sent?timestamp=${Date.now()}`, {
    params: {
      phone,
    },
  })
}

interface VerifyCaptchaType extends PhoneCodeType {}
export function verifyCaptcha(
  captcha: string,
  phone: string = "18257712408"
): Promise<AxiosResponse<VerifyCaptchaType>> {
  return request.get("/captcha/verify", {
    params: {
      phone,
      captcha,
    },
  })
}

export function loginByPhone(phone: string, captcha: string) {
  return request.post(`/login/cellphone?phone=${phone}&captcha=${captcha}`)
}

interface LoginQRKeyType {
  code: number
  data: {
    code: number
    unikey: string
  }
}
export function getLoginQRKey(): Promise<AxiosResponse<LoginQRKeyType>> {
  return request(`/login/qr/key?timestamp=${Date.now()}`)
}

interface LoginQRKeyCreateType {
  code: number
  data: {
    qrimg: string
  }
}
export function createLoginQR(
  key: string
): Promise<AxiosResponse<LoginQRKeyCreateType>> {
  return request(
    `/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`
  )
}

export enum QRCheckEnum {
  EXPIRED = 800,
  WAITING_SCANNING = 801,
  WAITING_CONFIRMING = 802,
  AUTH_SUCCESS = 803,
  NEED_NOCOOKIE = 502,
}
interface LoginQRCheckType {
  code: QRCheckEnum
  message: String
  cookie: string
}
export function checkLoginQR(
  key: string
): Promise<AxiosResponse<LoginQRCheckType>> {
  return request(`/login/qr/check?key=${key}&timestamp=${Date.now()}`)
}

interface LoginStatusType {
  data: UserAccountAPIType
}
export function getLoginStatus(): Promise<AxiosResponse<LoginStatusType>> {
  return request(`/login/status?timestamp=${Date.now()}`)
}

interface LogoutType {
  code: number
}
export function logout(): Promise<AxiosResponse<LogoutType>> {
  return request(`/logout?timestamp=${Date.now()}`)
}

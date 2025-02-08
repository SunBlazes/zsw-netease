import { ClearIcon, UserIcon } from "../Icon"
import { NModal } from "../NModal"
import React, { useEffect, useState } from "react"
import { Checkbox } from "@douyinfe/semi-ui"
import cls from "classnames"
import { getPhoneCaptcha, loginByPhone, verifyCaptcha } from "@/apis/login"
import QRLogin from "./QRLogin"
import { UserStatusEnum, useUserInfoStore } from "@/store/userInfoStore"

const phoneReg = /^\d{11}$/
const countDown = 60

type ModeType = "qr" | "phone" | "captcha"

const Login: React.FC = () => {
  const { status, nickname, avatarUrl } = useUserInfoStore(
    (state) => state.context
  )

  const [modalVisible, setModalVisible] = useState(false)
  const [phone, setPhone] = useState("")
  const [phoneValid, setPhoneValid] = useState(true)
  const [autoLogin, setAutoLogin] = useState(true)
  const [captcha, setCaptcha] = useState("")
  const [mode, setMode] = useState<ModeType>("qr")
  const [count, setCount] = useState(countDown)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(() => e.target.value)
  }

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptcha(() => e.target.value)
  }

  const handleBtnSubmit = () => {
    if (mode === "captcha") {
      handleLogin()
    } else {
      toCaptchaMode()
    }
  }

  const toCaptchaMode = () => {
    if (phoneReg.test(phone)) {
      getPhoneCaptcha().then(({ data }) => {
        console.log(data)
        if (data.data) setMode("captcha")
      })
    } else {
      setPhoneValid(false)
    }
  }

  const handleLogin = () => {
    verifyCaptcha(captcha).then(({ data }) => {
      if (data.data) {
        loginByPhone(phone, captcha).then(({ data }) => {
          console.log(data)
          setModalVisible(false)
        })
      }
    })
  }

  const handleReGetCaptcha = () => {
    startCountDown()
  }

  const startCountDown = () => {
    setCount(countDown)
    let timer = setInterval(() => {
      setCount((count) => {
        if (count <= 0) {
          clearInterval(timer)
        }
        return count - 1
      })
    }, 1000)
  }

  useEffect(() => {
    mode === "captcha" && startCountDown()
  }, [mode])

  //   useEffect(() => {
  //   getLoginStatus().then(({ data }) => {
  //     console.log(data)
  //   })
  // }, [])

  return (
    <div>
      <div className="w-40">
        <div
          className="flex items-center cursor-pointer w-fit"
          onClick={() => setModalVisible(true)}
        >
          <div className="rounded-full bg-gray-200 w-8 h-8 text-center">
            {status === UserStatusEnum.ONLINE ? (
              <img
                className="w-full h-full rounded-full"
                src={avatarUrl + "?param=64y64"}
              />
            ) : (
              <UserIcon className="text-slate-500 align-middle" size="large" />
            )}
          </div>
          <span className="ml-2 text-sm text-slate-500 hover:text-slate-700">
            {status === UserStatusEnum.ONLINE ? nickname : "未登录"}
          </span>
        </div>
      </div>

      {status === UserStatusEnum.OFFLINE && (
        <NModal
          visible={modalVisible}
          width={400}
          onCancel={() => setModalVisible(false)}
        >
          <div className="">
            <QRLogin
              visible={mode === "qr" && modalVisible}
              setModalVisible={setModalVisible}
            />
            <div className={cls({ hidden: mode === "qr" })}>
              <div className="space-x-2 flex justify-center text-xl">
                <span>网</span>
                <span>易</span>
                <span>云</span>
                <span>音</span>
                <span>乐</span>
              </div>
              <div className={cls({ hidden: mode !== "phone" })}>
                <div className="mt-8 bg-gray-50/75 h-9 rounded-full px-5 relative group order border-slate-200">
                  <span className="leading-9 text-slate-700">+86</span>
                  <span className="mx-4 leading-9 text-slate-700">|</span>
                  <input
                    type="text"
                    className="outline-none bg-transparent h-full text-sm text-slate-500"
                    placeholder="请输入手机号"
                    onChange={handlePhoneChange}
                    value={phone}
                    onClick={() => setPhoneValid(true)}
                  />
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:block"
                    onClick={() => setPhone("")}
                  >
                    <ClearIcon
                      size="large"
                      className="text-slate-400 cursor-pointer hover:text-slate-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={cls(
                      { hidden: phoneValid },
                      "text-primary text-sm"
                    )}
                  >
                    请输入11位数字的手机号
                  </span>
                  <Checkbox
                    className={cls({ hidden: !phoneValid }, "text-sm")}
                    checked={autoLogin}
                    extra="自动登录"
                    onChange={(e) => setAutoLogin(e.target.checked || false)}
                  />
                  <span className="text-sm text-slate-500">密码登录</span>
                </div>
              </div>
              <div className={cls({ hidden: mode !== "captcha" })}>
                <div className="mt-8 bg-gray-50/75 h-9 rounded-full px-5 group flex border border-slate-200">
                  <div
                    className={
                      "relative " + (count >= 0 ? "w-11/12" : "w-9/12")
                    }
                  >
                    <input
                      type="text"
                      className="w-10/12 outline-none bg-transparent h-full text-sm text-slate-500"
                      placeholder="请输入验证码"
                      onChange={handleCaptchaChange}
                      value={captcha}
                    />
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block"
                      onClick={() => setCaptcha("")}
                    >
                      <ClearIcon
                        size="large"
                        className="text-slate-400 cursor-pointer hover:text-slate-500"
                      />
                    </div>
                  </div>
                  <div
                    className={
                      "text-slate-400 h-full flex items-center " +
                      (count >= 0 ? "w-1/12" : "w-3/12")
                    }
                  >
                    <span className="text-xs">|</span>
                    <span className={cls("ml-2.5", { hidden: count <= -1 })}>
                      {count}
                    </span>
                    <div
                      className={cls(
                        { hidden: count >= 0 },
                        "ml-1.5 text-sm hover:text-slate-600 cursor-pointer"
                      )}
                      onClick={handleReGetCaptcha}
                    >
                      重新获取
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-3 flex justify-between">
                  <span> 验证码已通过短信发送</span>
                  <span>密码登录</span>
                </div>
              </div>
              <div
                className="text-center w-full mx-auto mt-14 bg-primary/75 py-2 text-white rounded-full cursor-pointer hover:bg-primary"
                onClick={handleBtnSubmit}
              >
                {mode === "captcha" ? "登录" : "验证码登录"}
              </div>
            </div>
          </div>
        </NModal>
      )}
    </div>
  )
}

export default Login

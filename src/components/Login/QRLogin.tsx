import { useCallback, useEffect, useState } from "react"
import { QRLoginProps } from "./types"
import cls from "classnames"
import {
  checkLoginQR,
  createLoginQR,
  getLoginQRKey,
  QRCheckEnum,
} from "@/apis/login"
import PhoneGuideQR from "@/assets/phone_guide_qr.png"
import {
  PHONE_ENTER,
  PHONE_LEAVE,
  QR_ENTER,
  QR_LEAVE,
} from "@/constants/animate"
import { Toast } from "@douyinfe/semi-ui"
import { getUserAccountAPI } from "@/apis/user"
import { useUserInfoStore } from "@/store/userInfoStore"
import { useShallow } from "zustand/shallow"
import { getLikelist } from "@/apis/love"
import { useLovedStore } from "@/store/LovedStore"

// 0代表第一次进入页面 1代表鼠标enter 2代表鼠标leave
enum MouseLocaType {
  DEFAULT = 0,
  ENTER = 1,
  LEAVE = 2,
}

const QRLogin: React.FC<QRLoginProps> = ({ visible, setModalVisible }) => {
  const { setInfo } = useUserInfoStore(
    useShallow(({ actions: { setInfo } }) => ({
      setInfo,
    }))
  )
  const setSongIds = useLovedStore(({ actions: { setSongIds } }) => setSongIds)

  const [mouseLoca, setMouseLoca] = useState<MouseLocaType>(
    MouseLocaType.DEFAULT
  )
  const [qrimage, setQRImage] = useState("")

  const handleMouseEnter = () => {
    setMouseLoca(MouseLocaType.ENTER)
  }

  const handleMouseLeave = () => {
    setMouseLoca(MouseLocaType.LEAVE)
  }

  const handleLoginCookie = useCallback((cookie: string) => {
    let tmp = ""
    cookie.split(";").forEach((item) => {
      item = item.trim()
      if (item === "HTTPOnly") {
        tmp += item + ";"
        document.cookie = tmp
        tmp = ""
      } else {
        const name = item.slice(0, item.indexOf("="))
        if (name !== "Max-Age" && name !== "Expires" && name !== "Path") {
          document.cookie = tmp
          tmp = item + ";"
        } else {
          tmp += item + ";"
        }
      }
    })
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    async function getQRCode() {
      const {
        data: {
          data: { unikey },
          code,
        },
      } = await getLoginQRKey()

      console.log(unikey, code)

      if (code === 200) {
        const {
          data: {
            data: { qrimg },
            code,
          },
        } = await createLoginQR(unikey)

        if (code === 200) {
          setQRImage(qrimg)

          timer = setInterval(async () => {
            const {
              data: { code, message, cookie },
            } = await checkLoginQR(unikey)

            if (code === QRCheckEnum.AUTH_SUCCESS) {
              clearInterval(timer)

              Toast.success({
                content: message,
                async onClose() {
                  handleLoginCookie(cookie)

                  const {
                    data: { profile },
                  } = await getUserAccountAPI()

                  if (profile) {
                    setInfo(profile)
                  }

                  if (profile) {
                    getLikelist(profile.userId).then(({ data: { ids } }) => {
                      setSongIds(ids.sort((a, b) => a - b))

                      setModalVisible(false)
                    })
                  }
                },
              })
            } else if (code === QRCheckEnum.EXPIRED) {
              Toast.error({
                content: message,
              })
            }
          }, 3000)
        }
      }
    }

    if (visible) {
      getQRCode()
    }

    return () => {
      clearInterval(timer)
    }
  }, [visible])

  return (
    <div
      className={cls({ hidden: !visible })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-xl font-bold text-center">扫码登录</div>
      <div className="flex mt-10 relative">
        <div
          className={cls("w-1/2 relative transition-all", {
            [PHONE_ENTER]: mouseLoca === 1,
            [PHONE_LEAVE]: mouseLoca === 2,
          })}
        >
          <img src={PhoneGuideQR} alt="" />
          <div
            style={{ boxShadow: "0px -16px 16px 5px white" }}
            className="absolute -bottom-4 left-0 right-0 h-4"
          ></div>
        </div>
        <div className="w-1/2">
          <div className="aspect-square w-[180px]">
            <div
              className={cls(
                "transition-all origin-top-right absolute aspect-square right-0 top-0 w-[150px]",
                {
                  [QR_ENTER]: mouseLoca === 1,
                  [QR_LEAVE]: mouseLoca === 2,
                }
              )}
            >
              <img src={qrimage} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRLogin

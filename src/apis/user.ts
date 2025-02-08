import { AxiosResponse } from "axios"
import request from "."
import { PlaylistDetailType } from "./playlist"

export interface UserInfoType {
  userId: number
  backgroundUrl: string
  avatarUrl: string
  accountStatus: number
  nickname: string
  vipType: number
}
export interface UserAccountAPIType {
  code: number
  account: {
    id: number
    vipType: number
    status: number
  }
  profile: UserInfoType | null
}
export function getUserAccountAPI(): Promise<
  AxiosResponse<UserAccountAPIType>
> {
  return request.post("/user/account")
}

interface UserPlaylistAPIType {
  more: boolean
  code: number
  playlist: PlaylistDetailType[]
}
export function getUserPlaylistAPI(
  uid = 1425924625
): Promise<AxiosResponse<UserPlaylistAPIType>> {
  return request(`/user/playlist?uid=${uid}&timestamp=${Date.now()}`)
}

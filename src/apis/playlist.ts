import { AxiosResponse } from "axios"
import request from "."
import { SongInfoType } from "./song"
import { UserInfoType } from "./user"

export enum SpecialTypeEnum {
  LOVED = 5,
  OTHER = 0,
}
export interface PlaylistDetailType {
  creator: UserInfoType
  userId: number
  coverImgUrl: string
  createTime: number
  trackUpdateTime: number
  playCount: number
  name: string
  id: number
  specialType: SpecialTypeEnum
}
interface PlaylistDetailAPIType {
  code: number
  playlist: PlaylistDetailType
}
export function getPlaylistDetailAPI(
  id: number
): Promise<AxiosResponse<PlaylistDetailAPIType>> {
  return request(`/playlist/detail?id=${id}&timestamp=${Date.now()}`)
}

interface PlaylistTrackAllAPIType {
  songs: SongInfoType[]
  code: number
}
export function getPlaylistTrackAllAPI(
  id: number
): Promise<AxiosResponse<PlaylistTrackAllAPIType>> {
  return request(`/playlist/track/all?id=${id}&timestamp=${Date.now()}`)
}

import { isArray } from "@/utils"
import request from "."
import { AxiosResponse } from "axios"
import { ArtistInfoType } from "./artist"
import { AlbumInfoType } from "./album"

export interface SongPlgType {}
export interface SongInfoType {
  name: string
  id: number
  ar: Partial<ArtistInfoType>[] // 歌手列表
  alia: string[]
  al: Partial<AlbumInfoType> // 专辑
  dt: number // 歌曲时长
  fee: FeeEnum
  mv: number // mv的id
  copyright: CopyrightEnum // 版权
  originCoverType: OriginCoverTypeEnum // 翻唱
  noCopyrightRcmd: Record<any, any> | null
  loved?: boolean
  url?: string
  lyric?: string
}
export enum FeeEnum {
  FREE = 0, // 免费或无版权
  VIP = 1, // vip版权
  PUCHASE_ALBUM = 4, // 购买专辑
  FREE_LOW = 8, // 非会员可免费播放低音质 会员可以播放高音质与下载
}
export enum CopyrightEnum {
  HOLD = 1,
  DO_NOT_HOLD = 2,
}
export enum OriginCoverTypeEnum {
  UNKNOWN = 0,
  ORIGIN = 1, // 原唱
  COVER = 2, // 翻唱
}
interface SongDetailType {
  songs: SongInfoType[]
  privileges: SongPlgType[]
  code: number
}
export function getSongDetail(
  ids: number[] | number
): Promise<AxiosResponse<SongDetailType>> {
  let url = "/song/detail?ids="

  if (isArray(ids)) {
    url += ids.join(",")
  } else {
    url += ids
  }

  return request(url + `&timestamp=${Date.now()}`)
}

type SongLevelType =
  | "standard"
  | "higher"
  | "exhigh"
  | "lossless"
  | "hires"
  | "jyeffect"
  | "sky"
  | "jymaster"
interface SongUrlType {
  id: number
  url: string
  size: number
  fee: FeeEnum
  level: SongLevelType
}
interface SongUrlAPIType {
  data: SongUrlType[]
  code: number
}
export function getSongUrlAPI(
  id: number | number[],
  level: SongLevelType = "standard"
): Promise<AxiosResponse<SongUrlAPIType>> {
  const ids = isArray(id) ? id.join(",") : id

  return request(
    `/song/url/v1?id=${ids}&level=${level}&timestamp=${Date.now()}`
  )
}

interface LyricType {
  code: number
  lrc: {
    lyric: string
  }
  uncollected?: boolean
}
export function getLyric(id: number): Promise<AxiosResponse<LyricType>> {
  return request(`/lyric?id=${id}&timestamp=${Date.now()}`)
}

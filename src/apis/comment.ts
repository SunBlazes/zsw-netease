import { AxiosResponse } from "axios"
import request from "."
import { UserInfoType } from "./user"

interface MusicCommentItemType {
  user: UserInfoType
  commentId: number
  content: string // 评论内容
  time: number // 评论时间
  timeStr: string // 格式化的评论时间
  likeCount: number // 喜欢评论数
  parentCommentId: number // 0表示不是楼中楼评论 其他则表示该评论所在的楼层评论id
  ipLocation: {
    ip: string | null
    location: string
    userId: number | null
  }
  liked: false // 是否喜欢该评论
  showFloorComment: {
    replyCount: number // 回复数
  }
}
interface MusicCommentType {
  isMusician: boolean
  userId: number
  moreHot: true
  hotComments: MusicCommentItemType[]
  comments: MusicCommentItemType[]
  code: number
  total: number
  more: true
}
export function getMusicComment(
  id: number,
  limit = 20
): Promise<AxiosResponse<MusicCommentType>> {
  return request(
    `/comment/music?id=${id}&limit=${limit}&timestamp=${Date.now()}`
  )
}

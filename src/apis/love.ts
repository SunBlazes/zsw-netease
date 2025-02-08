import { AxiosResponse } from "axios"
import request from "."

interface LikeListType {
  checkPoint: number
  code: number
  ids: number[]
}
export function getLikelist(
  uid = 1425924625
): Promise<AxiosResponse<LikeListType>> {
  return request(`/likelist?timestamp=${Date.now()}`, {
    params: {
      uid,
    },
  })
}

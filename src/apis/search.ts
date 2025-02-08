import { AxiosResponse } from "axios"
import request from "."

interface SearchDefaultType {
  code: number
  message: string | null
  data: {
    showKeyword: string
  }
}
export function getSearchDefault(): Promise<AxiosResponse<SearchDefaultType>> {
  return request.get(`/search/default?timestamp=${Date.now()}`)
}

interface SearchHotType {
  code: number
  result: {
    hots: { first: string }[]
  }
}
export function getSearchHot(): Promise<AxiosResponse<SearchHotType>> {
  return request.get(`/search/hot?timestamp=${Date.now()}`)
}

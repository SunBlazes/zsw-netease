import { SEARCH_HISTORY_KEY } from "@/constants/keys"
import localforage from "localforage"

export const getSearchHistoryData = (): Promise<Set<string> | null> => {
  return localforage.getItem(SEARCH_HISTORY_KEY)
}

export const addSearchHistoryData = async (
  keyword: string
): Promise<Set<string>> => {
  let res = await getSearchHistoryData()

  if (!res) res = new Set([keyword])
  else {
    res.add(keyword)
  }

  return localforage.setItem(SEARCH_HISTORY_KEY, res)
}

export const clearSearchHistoryData = () => {
  return localforage.setItem(SEARCH_HISTORY_KEY, null)
}

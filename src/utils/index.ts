import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export const noop = () => {}

export const isArray = Array.isArray

export const merge = Object.assign

// <= >
export const binarySearchRight = (
  data: any[],
  key: string | null,
  target: number
) => {
  let l = 0,
    r = data.length - 1

  while (l <= r) {
    const mid = (l + r) >> 1
    if ((key && data[mid][key] > target) || data[mid] > target) {
      r = mid - 1
    } else {
      l = mid + 1
    }
  }

  return l - 1
}

// < >=
export const binarySearchLeft = (
  data: any[],
  key: string | null,
  target: number
) => {
  let l = 0,
    r = data.length - 1

  while (l <= r) {
    const mid = (l + r) >> 1
    if ((key && data[mid][key] >= target) || data[mid] >= target) {
      r = mid - 1
    } else {
      l = mid + 1
    }
  }

  return r + 1
}

export const parseTime = (time: number) => {
  const hours = Math.floor(time / 60)
  const seconds = Math.floor(time - hours * 60)

  return `${hours.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

export const parseDate = (time: number, format = "YYYY-MM-DD") => {
  return dayjs(new Date(time).toISOString()).format(format)
}

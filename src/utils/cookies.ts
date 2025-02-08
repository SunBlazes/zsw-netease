export function setCookie(name: string, value: string, days = 30) {
  const date = new Date()
  date.setTime(Date.now() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${date.toUTCString()};Path=/;`
}

export function setAllCookie(str: string, days = 30) {
  const cookies = str.replace(/\s/g, "").split("")

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=")
    setCookie(name, value, days)
  })
}

export function getCookie(name: string): string | null {
  const reg = new RegExp(`${name}=(.*?)(?:;|$)`)
  const res = document.cookie.match(reg)
  if (res) {
    return decodeURIComponent(res[1])
  }
  return null
}

export function delCookie(name: string) {
  setCookie(name, "", 0)
}

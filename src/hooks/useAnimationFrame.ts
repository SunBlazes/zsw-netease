import { useCallback, useRef } from "react"
import { useEvent } from "./useEvent"

const useAnimationFrame = (callback: Function, interval = 16) => {
  const pausedRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  const stop = useCallback(() => {
    pausedRef.current = true
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  const start = useEvent(() => {
    if (rafIdRef.current !== null) return

    pausedRef.current = false
    lastTimeRef.current = 0
    const animate = (time: number) => {
      if (pausedRef.current) return

      let elapsedTime: number
      // time是根据页面加载时开始计算得到的
      if (lastTimeRef.current === 0) {
        elapsedTime = 0
        lastTimeRef.current = time - 16
      } else {
        elapsedTime = time - lastTimeRef.current
      }

      if (elapsedTime >= interval) {
        callback()
        lastTimeRef.current = time
      }

      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)
  })

  return { start, stop }
}

export default useAnimationFrame

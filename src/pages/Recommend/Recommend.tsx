import { useBgStore } from "@/store/bgStore"
import { useEffect } from "react"

const Recommend = () => {
  const setBg = useBgStore((state) => state.setBg)

  useEffect(() => {
    setBg("transparent")
  }, [])

  return <div>recommend</div>
}

export default Recommend

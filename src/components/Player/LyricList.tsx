import { useEffect, useMemo, useRef, useState } from "react"
// import lyric from "./lyric"
import LyricItem from "./LyricItem"
import { LyricListProps } from "./types"
import { binarySearchRight } from "@/utils"

const regExp = new RegExp(
  /^\[(?<minute>\d{2})\:(?<second>\d{2})\.(?<milisecond>\d{2,3})\](?<content>.+?)(?:$|\n)/gm
)

interface LryicItemType {
  id: number
  t: number
  minute: number
  second: number
  milisecond: number
  content: string
}

const scrollDis = 48

const LyricList: React.FC<LyricListProps> = ({ ct, lyric }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)

  const lyricData = useMemo(() => {
    const res: LryicItemType[] = []

    let tmp: RegExpExecArray | null = null
    while ((tmp = regExp.exec(lyric))) {
      let { minute, second, milisecond, content } = tmp.groups as any
      minute = parseInt(minute)
      second = parseInt(second)
      milisecond = parseInt(milisecond)

      res.push({
        id: res.length,
        t: minute * 60 + second + milisecond / 1000,
        minute: parseInt(minute),
        second: parseInt(second),
        milisecond: parseInt(milisecond),
        content: (content as string).trim(),
      })
    }

    return res
  }, [lyric])

  // useEffect(() => {
  //   scrollRef.current!.scrollBy({
  //     top: -5 * scrollDis,
  //     behavior: "smooth",
  //   })
  // }, [])

  // 歌词滚动
  useEffect(() => {
    setActiveLyricIndex(() => {
      let pos = binarySearchRight(lyricData, "t", ct)

      scrollRef.current!.scrollTo({
        top: pos * scrollDis - 4 * scrollDis,
        behavior: "smooth",
      })

      return pos
    })
  }, [ct, lyricData])

  return (
    <div
      className="overflow-y-scroll scrollbar-none max-h-[576px] min-h-[400px]"
      ref={scrollRef}
    >
      <div className="text-lg text-white/35">
        {lyricData.map((item, index) => (
          <LyricItem
            content={item.content}
            key={item.id}
            isActive={activeLyricIndex === index}
          />
        ))}
      </div>
    </div>
  )
}

export default LyricList

import { useCallback, useEffect, useRef, useState } from "react"
import { PlayerProps } from "./types"
import cls from "classnames"
import {
  PLAYER_ENTER_UP,
  PLAYER_LEAVE_DOWN,
  PLAYER_SPIN,
} from "@/constants/animate"
import { PlayerStatusEnum, usePlayerStore } from "@/store/playerStore"
import { useShallow } from "zustand/shallow"
import { getMostVibrantColor } from "@/utils/colorThief"
import { UpIcon } from "../Icon"
import LyricList from "./LyricList"
import { getLyric } from "@/apis/song"
import { usePlayQueueStore } from "@/store/playQueueStore"

const Player: React.FC<PlayerProps> = ({
  ct,
  visible,
  PlayerConsole,
  PlayerSlider,
  PlayerSchedule,
  onClose,
}) => {
  const status = usePlayerStore(useShallow(({ context: { status } }) => status))
  const { playingSong } = usePlayQueueStore(
    useShallow(({ context: { currIndex, songs } }) => ({
      playingSong: songs[currIndex],
    }))
  )
  const { id, ar, al, name } = playingSong

  const bgRef = useRef<HTMLDivElement>(null)
  const firstAppearRef = useRef(true)

  const [activeKey, setActiveKey] = useState(0)
  const [lyric, setLyric] = useState("")

  if (visible && firstAppearRef.current) {
    firstAppearRef.current = false
  }

  const handleOnClickForClosing = useCallback(
    (e: React.MouseEvent) => {
      onClose(e)

      e.stopPropagation()
      return false
    },
    [onClose]
  )

  useEffect(() => {
    async function getSongLyric() {
      let _lyric = playingSong.lyric

      if (!_lyric) {
        const {
          data: {
            lrc: { lyric },
          },
        } = await getLyric(id)
        _lyric = lyric
      }

      setLyric(_lyric)
      playingSong.lyric = _lyric
    }

    getSongLyric()
  }, [id])

  useEffect(() => {
    const handleImgLoad = () => {
      const color = getMostVibrantColor(img, 10, 2, 0.3, 0.5)
      bgRef.current!.style.background = `linear-gradient(to top, ${color[0]}, ${color[1]})`
    }

    const img = new Image()
    img.src = al.picUrl!
    img.setAttribute("crossOrigin", "")
    img.addEventListener("load", handleImgLoad)

    return () => {
      img.removeEventListener("load", handleImgLoad)
    }
  }, [id])

  return (
    <div
      className={cls(
        "fixed left-0 right-0 top-full bottom-0",
        !firstAppearRef.current
          ? visible
            ? PLAYER_ENTER_UP
            : PLAYER_LEAVE_DOWN
          : ""
      )}
      style={{
        zIndex: 1000,
        minWidth: 1200,
        minHeight: 850,
      }}
      ref={bgRef}
    >
      <div className="flex h-20 px-10 py-5">
        <div
          className="size-10 rounded-md p-1 group hover:bg-slate-50/5"
          onClick={handleOnClickForClosing}
          style={{ border: "0.2px solid rgba(255,255,255,0.1)" }}
        >
          <UpIcon className="rotate-180 text-white" size="full" />
        </div>
      </div>
      <div className="px-10 h-[calc(100vh-176px)]">
        <div className="flex justify-center h-full">
          <div className="flex-1 relative">
            <div
              style={{
                width: 400,
                height: 400,
                boxShadow: "0 0 10px 1px rgba(255,255,255,.2)",
                border: "1px solid rgba(248, 250, 252, 0.1)",
                top: "calc(50% - 200px)",
                animationPlayState:
                  status === PlayerStatusEnum.PLAYING ? "running" : "paused",
              }}
              className={cls(
                "p-4 bg-slate-50/5 absolute right-32 rounded-full",
                PLAYER_SPIN
              )}
            >
              <div
                className="w-full h-full rounded-full bg-black/80 p-4"
                style={{ boxShadow: "0 0 1px 3px rgba(0,0,0,0.1)" }}
              >
                <div
                  className="w-full h-full rounded-full p-2"
                  style={{ border: "0.1px solid rgba(0,0,0,.20)" }}
                >
                  <div
                    className="w-full h-full rounded-full p-2"
                    style={{ border: "0.1px solid rgba(0,0,0,.20)" }}
                  >
                    <div
                      className="w-full h-full rounded-full p-2"
                      style={{ border: "0.1px solid rgba(0,0,0,.20)" }}
                    >
                      <div
                        className="w-full h-full rounded-full p-2"
                        style={{ border: "0.1px solid rgba(0,0,0,.20)" }}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img
                            src={al.picUrl + "?param=500y500"}
                            alt=""
                            className="h-full w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="ml-32">
              <div className="text-white text-2xl">{name}</div>
              <div className="text-white/40 flex text-sm mt-4">
                <div className="w-1/2">
                  <span>专辑：</span>
                  <span className="cursor-pointer hover:text-white/75">
                    {al.name}
                  </span>
                </div>
                <div className="w-1/2">
                  <span>歌手：</span>
                  <span className="cursor-pointer text-white/40 hover:text-white/75">
                    {ar.map((item, index) => (
                      <span key={item.id} className="ml-1">
                        <span>{item.name}</span>
                        {index !== ar.length - 1 && <span>/</span>}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex w-fit bg-gray-100/5 h-8 py-0.5 rounded-full text-gray-200/60 mt-5 mb-4">
                  <span
                    className={cls("cursor-pointer h-full px-3 leading-7", {
                      ["bg-gray-100/20 rounded-full text-white font-bold"]:
                        activeKey === 0,
                    })}
                    onClick={() => setActiveKey(0)}
                  >
                    歌曲
                  </span>
                  <span
                    className={cls("cursor-pointer h-full px-3 leading-7", {
                      ["bg-gray-100/20 rounded-full text-white font-bold"]:
                        activeKey === 1,
                    })}
                    onClick={() => setActiveKey(1)}
                  >
                    百科
                  </span>
                  <span
                    className={cls("cursor-pointer h-full px-3 leading-7", {
                      ["bg-gray-100/20 rounded-full text-white font-bold"]:
                        activeKey === 2,
                    })}
                    onClick={() => setActiveKey(2)}
                  >
                    相似推荐
                  </span>
                </div>
                <div>
                  <LyricList ct={ct} lyric={lyric} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {PlayerSlider}
      <div
        className="w-screen h-20 bg-white/5 bottom-0 left-0 px-7 flex justify-between py-2"
        style={{ boxShadow: "0 0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <div className="h-full w-1/4">{PlayerSchedule}</div>
        <div className="h-full w-1/2">{PlayerConsole}</div>
        <div className="h-full w-1/4"></div>
      </div>
    </div>
  )
}

export default Player

import { usePlayQueueStore } from "@/store/playQueueStore"
import { GarbageIcon, PauseIcon, PlayIcon } from "../Icon"
import { FeeEnum, SongInfoType } from "@/apis/song"
import { parseTime } from "@/utils"
import { PlayerStatusEnum, usePlayerStore } from "@/store/playerStore"
import cls from "classnames"
import { useShallow } from "zustand/shallow"
import { useCallback, useState } from "react"
import { Toast } from "@douyinfe/semi-ui"
import { NModal } from "../NModal"

const PlayQueue: React.FC = () => {
  const { status, setPlayerStatus, getSongUrl } = usePlayerStore(
    useShallow(
      ({ context: { status }, actions: { setStatus, getSongUrl } }) => ({
        status,
        setPlayerStatus: setStatus,
        getSongUrl,
      })
    )
  )
  const { id, songs, playSong, clear } = usePlayQueueStore(
    useShallow(
      ({ context: { songs, currIndex }, actions: { playSong, clear } }) => ({
        playSong,
        id: currIndex !== -1 ? songs[currIndex].id : 0,
        songs,
        clear,
      })
    )
  )

  const [clearModalVisible, setClearModalVisible] = useState(false)

  const handlePlayClick = useCallback(
    (e: React.MouseEvent, song: SongInfoType, index: number) => {
      if (song.id !== id) {
        playSongHandler(song)
        playSong(index)
      } else {
        setPlayerStatus(PlayerStatusEnum.PLAYING)
      }

      e.stopPropagation()
      return false
    },
    [id]
  )
  const handlePauseClick = useCallback((e: React.MouseEvent) => {
    setPlayerStatus(PlayerStatusEnum.PAUSED)

    e.stopPropagation()
    return false
  }, [])
  const playSongHandler = useCallback(
    async (song: SongInfoType) => {
      if (song!.noCopyrightRcmd) {
        Toast.error({
          content: "该歌曲无版权",
        })

        return
      } else {
        const id = song!.id
        let url = song.url

        if (!url) {
          url = await getSongUrl(id)
        }
      }
    },
    [id]
  )
  const handleClear = (e: React.MouseEvent) => {
    clear()

    e.stopPropagation()
    return false
  }

  const handleOnCancelForClosing = useCallback((e: React.MouseEvent) => {
    setClearModalVisible(false)

    e.stopPropagation()
    return false
  }, [])

  return (
    <>
      <div className="w-[428px] py-4">
        <div className="p-4 pt-0 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold">播放列表</span>
            <span className="text-xs align-top ml-1 text-slate-400">
              {songs.length}
            </span>
          </div>
          <div
            className="text-slate-400 flex items-center cursor-pointer"
            onClick={() => setClearModalVisible(true)}
          >
            <GarbageIcon />
            <span className="ml-1 text-sm">清空</span>
          </div>
        </div>
        <div className="pt-2 h-[600px] overflow-y-scroll scrollbar overflow-x-hidden">
          <div className="space-y-4">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={cls(
                  "hover:bg-slate-200/30 [&.active]:bg-slate-200/30 px-4 py-2 h-16 flex justify-between items-center group",
                  {
                    active: song.id === id,
                  }
                )}
              >
                <div className="h-full bg-slate-200 aspect-square rounded-md overflow-hidden relative">
                  <img
                    className="h-full w-full"
                    src={song.al.picUrl + "?param=96y96"}
                    alt=""
                  />
                  <div className="flex justify-center items-center hidden group-hover:flex group-[.active]:flex absolute top-0 bottom-0 left-0 right-0 bg-black/30 text-white">
                    {id !== song.id ||
                    (id === song.id && status === PlayerStatusEnum.PAUSED) ? (
                      <PlayIcon
                        selection={1}
                        size="large"
                        onClick={(e) => handlePlayClick(e, song, index)}
                      />
                    ) : (
                      <PauseIcon
                        selection={1}
                        size="large"
                        onClick={handlePauseClick}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden h-full justify-center w-[calc(100%-124px)]">
                  <p className="group-[.active]:text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                    <span>{song.name}</span>
                    {song.alia.length > 0 && (
                      <span className="text-slate-500 ml-2">
                        ({song.alia.join("/")})
                      </span>
                    )}
                  </p>
                  <span className="text-slate-500 group-[.active]:text-primary overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                    {song.fee === FeeEnum.VIP && (
                      <span className="text-primary font-bold">VIP</span>
                    )}
                    <span className="text-slate-500 ml-2 group-[.active]:text-primary">
                      {song.ar[0].name}
                    </span>
                  </span>
                </div>
                <span className="text-slate-400 text-sm w-10">
                  {parseTime(song.dt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NModal visible={clearModalVisible} onCancel={handleOnCancelForClosing}>
        <div className="text-center">
          <div className="text-2xl text-slate-600 font-bold">
            确定要清空播放列表吗?
          </div>
          <div
            className="text-lg w-1/2 mx-auto mt-14 bg-primary/75 py-2 text-white rounded-full cursor-pointer hover:bg-primary"
            onClick={handleClear}
          >
            <span>确认</span>
          </div>
        </div>
      </NModal>
    </>
  )
}

export default PlayQueue

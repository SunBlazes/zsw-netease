import { Table, Toast } from "@douyinfe/semi-ui"
import { SongsListProps } from "./types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ColumnProps, OnRow } from "@douyinfe/semi-ui/lib/es/table"
import { FeeEnum, SongInfoType } from "@/apis/song"
import { ArtistInfoType } from "@/apis/artist"
import { LoveIcon, NotLoveIcon, PauseIcon, PlayIcon } from "@/components/Icon"
import { binarySearchLeft, parseTime } from "@/utils"
import { PlayerStatusEnum, usePlayerStore } from "@/store/playerStore"
import { getPlaylistTrackAllAPI } from "@/apis/playlist"
import { useShallow } from "zustand/shallow"
import cls from "classnames"
import { useLovedStore } from "@/store/LovedStore"
import { usePlayQueueStore } from "@/store/playQueueStore"

const SongsList: React.FC<SongsListProps> = ({ id }) => {
  // 显示 歌单歌曲信息 加载
  const [loading, setLoading] = useState(true)
  // 获取到的歌单歌曲详情
  const [dataSoruce, setDataSource] = useState<SongInfoType[]>([])

  // playerStatus播放器状态
  const { playerStatus, setPlayerStatus, getSongUrl } = usePlayerStore(
    useShallow(
      ({ context: { status }, actions: { setStatus, getSongUrl } }) => ({
        playerStatus: status,
        setPlayerStatus: setStatus,
        getSongUrl,
      })
    )
  )
  // 喜欢列表的歌曲ID列表
  const lovedIds = useLovedStore(({ context: { songIds } }) => songIds)
  const { addSong, songId } = usePlayQueueStore(
    useShallow(({ actions: { addSong }, context: { currIndex, songs } }) => ({
      addSong,
      songId: currIndex !== -1 ? songs[currIndex].id : 0,
    }))
  )

  const parseArtist2Names = useCallback(
    (artists: Partial<ArtistInfoType>[]) => {
      return artists.map((artist) => artist.name)
    },
    []
  )

  // 播放歌曲
  const playSongHandler = async (record: SongInfoType) => {
    if (record!.noCopyrightRcmd) {
      Toast.error({
        content: "该歌曲无版权",
      })

      return
    } else {
      const id = record.id
      let url = record.url

      if (!url) {
        url = await getSongUrl(id)
      }

      record.url = url

      // 立即播放
      addSong({ ...record, url }, true)
    }
  }

  // 表格行属性，包括事件和样式
  const handleRow: OnRow<SongInfoType> = useCallback((record) => {
    return {
      className:
        "group has-[.playing]:bg-white/50 hover:bg-white/50 hover:shadow-[0px_0px_10px_1px_rgba(0,0,0,0.07)]",
      onClick(e) {
        playSongHandler(record!)

        e.stopPropagation()
        return false
      },
    }
  }, [])

  // 播放按钮的点击事件
  const handleOnClickForPlayBtn = (
    e: React.MouseEvent,
    record: SongInfoType
  ) => {
    if (record.id !== songId) {
      playSongHandler(record)
    } else if (playerStatus === PlayerStatusEnum.PAUSED) {
      setPlayerStatus(PlayerStatusEnum.PLAYING)
    } else {
      setPlayerStatus(PlayerStatusEnum.PAUSED)
    }

    e.stopPropagation()

    return false
  }

  const memorizedColumns = useMemo<ColumnProps[]>(() => {
    return [
      {
        title: "#",
        className: "font-normal bg-transparent border-b-1 border-slate-200/50",
        width: 60,
        render(...obj) {
          const r = obj[1] as SongInfoType

          return (
            <div className="h-full">
              <div
                className={cls("hidden group-hover:block", {
                  playing: songId === r.id,
                })}
                onClick={(e) => handleOnClickForPlayBtn(e, r)}
              >
                {songId !== r.id ||
                (songId === r.id &&
                  playerStatus === PlayerStatusEnum.PAUSED) ? (
                  <PlayIcon
                    selection={1}
                    size="extra-large"
                    className="-ml-1 text-slate-500 hover:text-slate-800"
                  />
                ) : (
                  <PauseIcon
                    selection={1}
                    size="extra-large"
                    className="-ml-1 text-slate-500 hover:text-slate-800"
                  />
                )}
              </div>
              <span className="text-slate-500 group-hover:hidden">
                {(obj[2] + 1 + "").padStart(2, "0")}
              </span>
            </div>
          )
        },
      },
      {
        title: "标题",
        className: "font-normal bg-transparent border-b-1 border-slate-200/50",
        dataIndex: "name",
        width: 600,
        render(_, record) {
          const r = record as SongInfoType
          return (
            <div
              className={cls("group flex space-x-3 h-10", {
                active: songId === r.id,
              })}
            >
              <div className="h-full aspect-square rounded-md overflow-hidden">
                <img
                  className="h-full w-full"
                  src={r.al.picUrl + "?param=80y80"}
                  alt=""
                />
              </div>
              <div className="h-full flex flex-col justify-between py-0.5">
                <div className="text-sm">
                  <span className="group-[.active]:text-primary text-slate-800">
                    {r.name}
                  </span>
                  {r.alia.length > 0 && (
                    <span className="text-slate-500 ml-2">
                      ({r.alia.join("/")})
                    </span>
                  )}
                </div>
                <div className="text-xs flex space-x-2">
                  {r.noCopyrightRcmd !== null && (
                    <span className="text-[#5975b2] font-bold">无音源</span>
                  )}
                  {r.fee === FeeEnum.VIP && (
                    <span className="text-primary font-bold">VIP</span>
                  )}
                  <div className="group-[.active]:text-primary text-slate-500">
                    {parseArtist2Names(r.ar).map((name) => (
                      <span
                        key={name}
                        className="group-[.active]:hover:text-inherit hover:text-slate-700 cursor-pointer"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        },
      },
      {
        title: "专辑",
        className: "font-normal bg-transparent border-b-1 border-slate-200/50",
        dataIndex: "al",
        ellipsis: true,
        width: 300,
        render(text) {
          return (
            <span className="text-slate-500 hover:text-slate-700 cursor-pointer">
              {text.name}
            </span>
          )
        },
      },
      {
        title: "喜欢",
        className: "font-normal bg-transparent border-b-1 border-slate-200/50",
        dataIndex: "love",
        width: 60,
        render(_, r: SongInfoType) {
          return r.loved ? (
            <LoveIcon overlay size="large" className="text-primary" />
          ) : (
            <NotLoveIcon size="large" className="text-primary" />
          )
        },
      },
      {
        title: "时长",
        className: "font-normal bg-transparent border-b-1 border-slate-200/50",
        dataIndex: "dt",
        width: 100,
        render(text) {
          return <span className="text-slate-500">{parseTime(text)}</span>
        },
      },
    ]
  }, [songId, playerStatus])

  // 根据 表单ID和喜欢列表变动 而重新执行
  useEffect(() => {
    let ignore = false

    async function getPlaylistSongs() {
      setLoading(true)

      const {
        data: { songs },
      } = await getPlaylistTrackAllAPI(id)
      if (!ignore) {
        setDataSource(
          songs.map((song) => {
            const pos = binarySearchLeft(lovedIds, null, song.id)

            return {
              ...song,
              loved: lovedIds[pos] === song.id,
              // 默认返回的时长dt单位为毫秒
              dt: song.dt / 1000,
            }
          })
        )
      }

      setLoading(false)
    }

    getPlaylistSongs()
    return () => {
      ignore = true
    }
  }, [id, lovedIds])

  return (
    <div>
      <Table
        rowKey="id"
        columns={memorizedColumns}
        dataSource={dataSoruce}
        className="bg-transparent"
        pagination={false}
        loading={loading}
        onRow={handleRow}
      />
    </div>
  )
}

export default SongsList

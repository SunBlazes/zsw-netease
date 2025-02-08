import { ALBUM_SPIN } from "@/constants/animate"
import { PlayerStatusEnum, usePlayerStore } from "@/store/playerStore"
import cls from "classnames"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NSlider } from "../NSlider"
import {
  ListPlayIcon,
  LoveIcon,
  MuteIcon,
  NextSongIcon,
  NotLoveIcon,
  PauseIcon,
  PlayIcon,
  PlaylistIcon,
  SeqPlayIcon,
  ShufflePlayIcon,
  SinglePlayIcon,
} from "../Icon"
import useAnimationFrame from "@/hooks/useAnimationFrame"
import { Player } from "../Player"
import { parseTime } from "@/utils"
import { useShallow } from "zustand/shallow"
import { VolumeIcon } from "../Icon"
import { NTooltip } from "../NTooltip"
import { NSideSheet } from "../NSideSheet"
import PlayQueue from "./PlayQueue"
import { PlayModeEnum, usePlayQueueStore } from "@/store/playQueueStore"
import { useEvent } from "@/hooks/useEvent"

enum PageStatusEnum {
  BLURRED = 0,
  FOCUSED = 1,
}

const Playerbar: React.FC = () => {
  const { playerStatus, setPlayerStatus } = usePlayerStore(
    useShallow(({ context: { status }, actions: { setStatus } }) => ({
      playerStatus: status,
      setPlayerStatus: setStatus,
    }))
  )
  const { songs, currIndex, playNextSong, playPrevSong } = usePlayQueueStore(
    useShallow(
      ({
        actions: { playPrevSong, playNextSong },
        context: { currIndex, songs },
      }) => ({
        playPrevSong,
        playNextSong,
        songs,
        currIndex,
        queueLen: songs.length,
      })
    )
  )
  const playingSong = songs[currIndex]
  const { dt, id, url, ar, al, name, loved } = playingSong

  const duration = Math.floor(dt)

  const audioRef = useRef<HTMLAudioElement>(null)
  const canPlayRef = useRef(false) // 播放器是否可以播放歌曲
  const preVolumeRef = useRef(100) // 保存点击静音时的音量
  const pageStatusRef = useRef<PageStatusEnum>(PageStatusEnum.FOCUSED) // 页面状态

  const [ct, setCt] = useState(0) // 当前播放时长
  const [volume, setVolume] = useState(0) // 音量
  const [playMode, setPlayMode] = useState<PlayModeEnum>(0) // 播放模式
  const [playerVisible, setPlayerVisible] = useState(false)
  const [playQueueVisible, setPlayQueueVisible] = useState(false) // 播放列表可视状态

  const parsedCt = parseTime(ct)

  // 缓存格式化后的总时长
  const memorizedParsedDt = useMemo(() => parseTime(duration), [duration])
  // 缓存播放模式组件
  const memorizedModeArr = useMemo(() => {
    return [
      <SeqPlayIcon size="extra-large" />,
      <ListPlayIcon size="extra-large" />,
      <SinglePlayIcon size="extra-large" />,
      <ShufflePlayIcon size="extra-large" />,
    ]
  }, [])

  // 控制进度条状态
  const cb = () => {
    setCt((ct) => {
      if (ct >= duration) {
        stop()
        return ct
      }
      return ct + 1
    })
  }
  // start开启进度条随时间变化    stop停止进度条变化
  const { start, stop } = useAnimationFrame(cb, 1000)

  // 播放模式切换
  const handleOnClickForPlayModeBtn = useCallback((e: React.MouseEvent) => {
    setPlayMode((mode) => (mode + 1) % memorizedModeArr.length)

    e.stopPropagation()
    return false
  }, [])
  // 开始播放
  const startPlayingHandler = useCallback(() => {
    audioRef.current!.play().then(() => {
      // 页面失去焦点，不进行dom的页面更新
      if (pageStatusRef.current === PageStatusEnum.FOCUSED) {
        // 进度条开始变化
        start()
      }
    })
  }, [])
  // 停止播放
  const pausePlayingHandler = useCallback(() => {
    audioRef.current!.pause()
    // 进度条停止自动变化
    stop()
  }, [])
  // 播放/停止按钮的点击事件：切换播放状态（播放 <=> 暂停）
  const handleOnClickForPlayBtn = useEvent((e: React.MouseEvent) => {
    if (playerStatus === PlayerStatusEnum.PLAYING) {
      setPlayerStatus(PlayerStatusEnum.PAUSED)
    } else {
      setPlayerStatus(PlayerStatusEnum.PLAYING)
    }

    e.stopPropagation()
    return false
  })

  // 喜欢点击事件
  const handleOnClickForLoveBtn = useEvent((e: React.MouseEvent) => {
    e.stopPropagation()

    return false
  })
  // 不喜欢点击事件
  const handleOnClickForNotLoveBtn = useEvent((e: React.MouseEvent) => {
    e.stopPropagation()

    return false
  })
  // 下一首点击事件
  const handleOnClickForNextSong = useEvent((e: React.MouseEvent) => {
    const index = playNextSong(playMode)

    // audio对同一个url不会自动触发load事件，这里是强制触发load
    if (index === currIndex) {
      pausePlayingHandler()
      setCt(0)

      audioRef.current!.load()
    }

    e.stopPropagation()
    return false
  })
  // 上一首点击事件
  const handleOnClickForPrevSong = useEvent((e: React.MouseEvent) => {
    const index = playPrevSong(playMode)

    // audio对同一个url不会自动触发load事件，这里是强制触发load
    if (index === currIndex) {
      pausePlayingHandler()
      setCt(0)

      audioRef.current!.load()
    }

    e.stopPropagation()
    return false
  })

  // 歌曲进度条拖拽进行
  const handleOnChangingForProgress = useEvent((value: number) => {
    setCt(value)
    // 停止自动变化
    stop()
  })
  // 歌曲进度条拖拽结束
  const handleOnChangedForProgress = useEvent((value: number) => {
    setCt(() => {
      audioRef.current!.currentTime = value

      return value
    })

    // 如果拖拽时处于播放状态，则拖拽结束时启动进度条的自动变化
    if (playerStatus === PlayerStatusEnum.PLAYING) {
      start()
    }
  })

  // 拖拽音量进度条持续变化
  const handleOnChangingForVolume = useEvent((value: number) =>
    setVolume(value)
  )
  // 拖拽音量进度条变化结束
  const handleOnChangedForVolume = useCallback((value: number) => {
    setVolume(value)
    audioRef.current!.volume = value / 100
  }, [])
  // 静音
  const handleOnClickForMuteBtn = useEvent((e: React.MouseEvent) => {
    // 保存此时的音量
    preVolumeRef.current = volume

    // 静音
    setVolume(0)
    audioRef.current!.volume = 0

    e.stopPropagation()
    return false
  })
  // 解除静音
  const handleOnClickForNotMuteBtn = useCallback((e: React.MouseEvent) => {
    // 恢复点击静音按钮前的音量
    setVolume(preVolumeRef.current)
    audioRef.current!.volume = preVolumeRef.current / 100

    e.stopPropagation()
    return false
  }, [])

  // player加载资源事件
  const handleOnCanPlay = useCallback(() => {
    console.log("canplay")
    canPlayRef.current = true

    setPlayerStatus(PlayerStatusEnum.PLAYING)
    startPlayingHandler()
  }, [])
  // player播放结束事件
  const handleOnEnded = useEvent(() => {
    pausePlayingHandler()
    // 重置进度条进度
    setCt(0)

    // 顺序播放，播放完最后一首停止
    if (currIndex === songs.length - 1 && playMode === PlayModeEnum.SEQUENCE) {
      // 设置player播放暂停
      setPlayerStatus(PlayerStatusEnum.PAUSED)
    } else {
      const index = playNextSong(playMode)
      if (index === currIndex) {
        audioRef.current!.load()
      } else {
        canPlayRef.current = false
      }
    }
  })
  // player缓冲事件
  const hanldeOnWaitingForAudio = useCallback(() => {
    canPlayRef.current = false
    pausePlayingHandler()
    console.log("waiting")
  }, [])
  // player播放报错事件
  const handleOnErrorForAudio = () => {
    console.log("error")
  }

  // 展示Player
  const handleOnClickForShowingPlayer = useCallback((e: React.MouseEvent) => {
    setPlayerVisible(true)

    e.stopPropagation()
    return false
  }, [])
  // 关闭Player
  const handleOnCloseForPlayer = useCallback(() => {
    setPlayerVisible(false)
  }, [])

  // 展示播放列表
  const handleOnClickForShowingPlayQueue = useCallback(
    (e: React.MouseEvent) => {
      setPlayQueueVisible(true)

      e.stopPropagation()
      return false
    },
    []
  )
  // 关闭播放列表的回调
  const handleOnCloseForPlayerQueue = useCallback(() => {
    setPlayQueueVisible(false)
  }, [])

  // 缓存tooltip的内容组件
  const memorizedTooltipCom = useMemo(
    () => (
      <NTooltip
        content={
          <div className="flex flex-col">
            <div className="h-24 mx-auto">
              <NSlider
                vertical
                value={volume}
                onChange={handleOnChangingForVolume}
                onAfterChange={handleOnChangedForVolume}
              />
            </div>
            <span className="text-xs mt-1 w-8 text-center">
              {Math.round(volume)}%
            </span>
          </div>
        }
        position="top"
      >
        {volume > 0 ? (
          <VolumeIcon
            size="extra-large"
            className="text-slate-500 hover:text-slate-800"
            onClick={handleOnClickForMuteBtn}
          />
        ) : (
          <MuteIcon
            size="extra-large"
            className="text-slate-500 hover:text-slate-800"
            onClick={handleOnClickForNotMuteBtn}
          />
        )}
      </NTooltip>
    ),
    [volume]
  )
  const retConsoleCom = useCallback(
    (
      type: 0 | 1,
      loved: boolean | undefined,
      playerStatus: PlayerStatusEnum,
      playMode: PlayModeEnum
    ) => {
      const className = !type
        ? "text-slate-600 hover:text-gray-800"
        : "text-white/50 hover:text-white/75"

      return (
        <div className="flex h-full justify-center items-center space-x-5">
          {loved ? (
            <LoveIcon
              overlay
              size="extra-large"
              className="text-primary"
              onClick={handleOnClickForLoveBtn}
            />
          ) : (
            <NotLoveIcon
              size="extra-large"
              className={className}
              onClick={handleOnClickForNotLoveBtn}
            />
          )}
          <NextSongIcon
            size="extra-large"
            className={cls(className, "rotate-180")}
            onClick={handleOnClickForPrevSong}
          />
          <div
            className="text-primary size-10 hover:scale-110"
            onClick={handleOnClickForPlayBtn}
          >
            {playerStatus === PlayerStatusEnum.PAUSED ? (
              <PlayIcon overlay size="full" />
            ) : (
              <PauseIcon overlay size="full" />
            )}
          </div>
          <NextSongIcon
            size="extra-large"
            className={className}
            onClick={handleOnClickForNextSong}
          />
          <div
            className={cls("h-fit text-zero", className)}
            onClick={handleOnClickForPlayModeBtn}
          >
            {memorizedModeArr[playMode]}
          </div>
        </div>
      )
    },
    []
  )
  // 缓存播放控制台
  const memorizedConsoleCom = useMemo(
    () => retConsoleCom(0, loved, playerStatus, playMode),
    [loved, playerStatus, playMode]
  )
  // 缓存播放控制台
  const memorizedPlayerConsoleCom = useMemo(
    () => retConsoleCom(1, loved, playerStatus, playMode),
    [loved, playerStatus, playMode]
  )

  // 处理游览器失去和得到焦点产生的副作用
  useEffect(() => {
    function handleBlur() {
      console.log("blur")
      pageStatusRef.current = PageStatusEnum.BLURRED
      stop()
    }

    function handleFocus() {
      console.log("focus")
      pageStatusRef.current = PageStatusEnum.FOCUSED
      if (playerStatus === PlayerStatusEnum.PLAYING) {
        setCt(() => {
          return audioRef.current!.currentTime
        })
        start()
      }
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
    }
  }, [playerStatus])

  // 根据此时播放状态执行 播放/暂停dom操作
  useEffect(() => {
    if (playerStatus === PlayerStatusEnum.PLAYING) {
      startPlayingHandler()
    } else {
      pausePlayingHandler()
    }
  }, [playerStatus])

  // 切换url资源的副作用
  useEffect(() => {
    pausePlayingHandler()
    setCt(0)
    canPlayRef.current = false
  }, [id])

  // 初始音量的设置
  useEffect(() => {
    setVolume(audioRef.current!.volume * 100)
  }, [])

  return (
    <>
      <div className="fixed w-screen h-20 bg-white bottom-0 left-0 shadow-2xl px-7 flex justify-between py-2 z-[999] min-w-[1200px]">
        <div className="h-full flex w-[350px]">
          <div
            className="h-full aspect-square p-2 bg-black rounded-full overflow-hidden cursor-pointer"
            onClick={handleOnClickForShowingPlayer}
          >
            <div
              className={cls(
                "h-full aspect-square rounded-full overflow-hidden",
                ALBUM_SPIN
              )}
              style={{
                animationPlayState:
                  playerStatus === PlayerStatusEnum.PLAYING
                    ? "running"
                    : "paused",
              }}
            >
              <img
                src={al.picUrl + "?param=112y112"}
                alt=""
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="ml-4 h-full py-1 flex flex-col justify-center">
            <div>
              <span className="text-slate-700">{name}-</span>
              {ar.map((item, index) => (
                <span key={item.id} className="text-sm ml-1">
                  <span className="text-slate-400">{item.name}</span>
                  {index !== ar.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-between py-1">
          {memorizedConsoleCom}
          <div className="flex justify-between items-center w-[450px]">
            <div className="text-xs text-slate-400">{parsedCt}</div>
            <div className="w-[350px]">
              <NSlider
                max={duration}
                value={ct}
                onChange={handleOnChangingForProgress}
                onAfterChange={handleOnChangedForProgress}
              />
            </div>
            <div className="text-xs text-slate-400">{memorizedParsedDt}</div>
          </div>
        </div>
        <div className="h-full w-[350px] flex justify-end space-x-5 items-center text-zero">
          {memorizedTooltipCom}
          <PlaylistIcon
            size="extra-large"
            className="text-slate-500 hover:text-slate-800"
            onClick={handleOnClickForShowingPlayQueue}
          />
        </div>
      </div>
      <Player
        ct={ct}
        visible={playerVisible}
        PlayerSlider={
          <NSlider
            max={duration}
            value={ct}
            railStyle={{ backgroundColor: "transparent" }}
            onChange={handleOnChangingForProgress}
            onAfterChange={handleOnChangedForProgress}
          />
        }
        PlayerConsole={memorizedPlayerConsoleCom}
        PlayerSchedule={
          <div className="flex text-white/50 h-full items-center space-x-1 text-sm">
            <div>{parsedCt}</div>
            <div>/</div>
            <div>{memorizedParsedDt}</div>
          </div>
        }
        onClose={handleOnCloseForPlayer}
      />
      <audio
        src={url}
        ref={audioRef}
        onCanPlay={handleOnCanPlay}
        onEnded={handleOnEnded}
        onWaiting={hanldeOnWaitingForAudio}
        onError={handleOnErrorForAudio}
      />
      <NSideSheet
        visible={playQueueVisible}
        onClose={handleOnCloseForPlayerQueue}
        className="bottom-[96px] rounded-tl-lg rounded-bl-lg"
        mask={false}
      >
        <PlayQueue />
      </NSideSheet>
    </>
  )
}

export default Playerbar

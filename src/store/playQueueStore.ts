import { SongInfoType } from "@/apis/song"
import { create } from "zustand"

export enum PlayModeEnum {
  SEQUENCE = 0, // 顺序播放
  LIST = 1, // 列表循环
  SINGLE = 2, // 单曲循环
  SHUFFLE = 3, // 随机播放
}

interface PlayQueueStoreStateType {
  songs: SongInfoType[]
  // 当前正在播放的歌曲索引
  currIndex: number
}

interface PlayQueueStoreActionType {
  // 更新列表歌曲信息
  setSongs: (songs: SongInfoType[]) => void
  // 播放索引为index的歌曲
  playSong: (index: number) => void
  // 将歌曲添加进列表，immediate表示是否立即播放该歌曲
  addSong: (Song: SongInfoType, immediate?: boolean) => void
  // 移除索引为index的歌曲
  removeSong: (index: number) => void
  clear: () => void
  // 返回上一首的index并设置currIndex
  playPrevSong: (mode: PlayModeEnum) => number
  // 返回下一首的index并设置currIndex
  playNextSong: (mode: PlayModeEnum) => number
  // 由于歌曲的url一段时间后失效，需要通过再次请求url来更新该歌曲的url信息
  updateSongUrl: (index: number, url: string) => void
}

interface PlayQueueStoreType {
  context: PlayQueueStoreStateType
  actions: PlayQueueStoreActionType
}

const usePlayQueueStore = create<PlayQueueStoreType>()((set, get) => ({
  context: {
    songs: [],
    currIndex: -1,
  },
  actions: {
    setSongs: (songs) => set(() => ({ context: { songs, currIndex: 0 } })),
    playSong: (index: number) =>
      set((state) => ({ context: { ...state.context, currIndex: index } })),
    addSong: (song, immediate = false) => {
      const songs = [...get().context.songs]
      const currIndex = get().context.currIndex
      // 播放索引
      let willIndex = songs.findIndex((item) => item.id === song.id)

      // 防止重复进队列
      if (willIndex === -1) {
        // 放置在下一首的位置
        songs.splice(currIndex + 1, 0, song)
        // 立即播放
        if (immediate) {
          willIndex = currIndex + 1
        }
      }

      set(() => ({
        context: { songs, currIndex: immediate ? willIndex : currIndex },
      }))
    },
    removeSong: (index: number) => {
      const { currIndex, songs } = get().context
      let willIndex = currIndex

      // 如果index刚好是正在播放的歌曲位置
      if (currIndex === index) {
        willIndex = songs.length > 1 ? (index + 1) % (songs.length - 1) : -1
      }

      songs.splice(index, 1)

      set(() => ({ context: { currIndex: willIndex, songs } }))
    },
    clear: () => set(() => ({ context: { currIndex: -1, songs: [] } })),
    playPrevSong: (mode) => {
      const { currIndex, songs } = get().context
      const { playSong } = get().actions

      let playIndex: number

      switch (mode) {
        case PlayModeEnum.SHUFFLE: {
          playIndex = Math.floor(Math.random() * songs.length)
          break
        }
        case PlayModeEnum.SINGLE: {
          playIndex = currIndex
          break
        }
        default: {
          playIndex = (currIndex - 1 + songs.length) % songs.length
        }
      }

      playSong(playIndex)

      return playIndex
    },
    playNextSong: (mode) => {
      const { currIndex, songs } = get().context
      const { playSong } = get().actions

      let playIndex: number

      switch (mode) {
        case PlayModeEnum.SHUFFLE: {
          playIndex = Math.floor(Math.random() * songs.length)
          break
        }
        case PlayModeEnum.SINGLE: {
          playIndex = currIndex
          break
        }
        default: {
          playIndex = (currIndex + 1 + songs.length) % songs.length
        }
      }

      playSong(playIndex)

      return playIndex
    },
    updateSongUrl: (index, url) => {
      const songs = get().context.songs
      songs[index].url = url
    },
  },
}))

export { usePlayQueueStore }

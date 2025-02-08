import { getSongUrlAPI } from "@/apis/song"
import { create } from "zustand"

enum PlayerStatusEnum {
  PAUSED = 0,
  PLAYING = 1,
}
interface PlayerStoreStateType {
  // 播放器状态
  status: PlayerStatusEnum
  visible: boolean
}

interface PlayerStoreActionType {
  setStatus: (status: PlayerStatusEnum) => void
  // 获取歌曲Url
  getSongUrl: (id: number) => Promise<string>
}

interface PlayerStoreType {
  context: PlayerStoreStateType
  actions: PlayerStoreActionType
}
const usePlayerStore = create<PlayerStoreType>()((set) => ({
  context: {
    status: PlayerStatusEnum.PAUSED,
    visible: false,
  },
  actions: {
    setStatus: (status) =>
      set((state) => ({ context: { ...state.context, status } })),
    getSongUrl: async (id) => {
      const {
        data: { data },
      } = await getSongUrlAPI(id)

      const pos = data[0].url.indexOf("?")
      const url = data[0].url.substring(0, pos)

      return url
    },
  },
}))

export { usePlayerStore, type PlayerStoreType, PlayerStatusEnum }

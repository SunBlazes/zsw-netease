import { create } from "zustand"

interface BgStoreStateType {
  bg: string
}

interface BgStoreActionType {
  setBg: (bg: string) => void
}

type bgStoreType = BgStoreStateType & BgStoreActionType

const useBgStore = create<bgStoreType>()((set) => ({
  bg: "transparent",
  setBg: (bg: string) => set(() => ({ bg })),
}))

export { useBgStore }

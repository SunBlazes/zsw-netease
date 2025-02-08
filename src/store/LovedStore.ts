import localforage from "localforage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface LovedStoreStateType {
  songIds: number[]
}

interface LovedStoreActionType {
  setSongIds: (ids: number[]) => void
}

interface LovedStoreType {
  context: LovedStoreStateType
  actions: LovedStoreActionType
}

const useLovedStore = create<LovedStoreType>()(
  persist(
    (set) => ({
      context: { songIds: [] },
      actions: {
        setSongIds: (ids: number[]) =>
          set(() => ({ context: { songIds: ids } })),
      },
    }),
    {
      name: "loved-storage",
      storage: createJSONStorage(() => localforage),
      partialize: (state) => state.context,
      merge(persistedState, currentState) {
        return {
          context: persistedState as LovedStoreStateType,
          actions: currentState.actions,
        }
      },
    }
  )
)

export { useLovedStore }

import { UserInfoType } from "@/apis/user"
import localforage from "localforage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export enum UserStatusEnum {
  OFFLINE = 0,
  ONLINE = 1,
}

interface UserInfoStoreStateType extends UserInfoType {
  status: UserStatusEnum
}

interface UserInfoStoreActionType {
  setInfo: (info: UserInfoType) => void
}

interface UserInfoStoreType {
  context: UserInfoStoreStateType
  actions: UserInfoStoreActionType
}

const useUserInfoStore = create<UserInfoStoreType>()(
  persist(
    (set) => ({
      context: {
        userId: -1,
        backgroundUrl: "",
        avatarUrl: "",
        accountStatus: 0,
        nickname: "",
        vipType: 0,
        status: UserStatusEnum.OFFLINE,
      },
      actions: {
        setInfo: (info: UserInfoType) => {
          set(() => ({ context: { ...info, status: UserStatusEnum.ONLINE } }))
        },
      },
    }),
    {
      name: "userInfo-storage",
      storage: createJSONStorage(() => localforage),
      partialize: (state) => state.context,
      merge(persistedState, currentState) {
        return {
          context: persistedState as UserInfoStoreStateType,
          actions: currentState.actions,
        }
      },
    }
  )
)

export { useUserInfoStore, type UserInfoStoreStateType }

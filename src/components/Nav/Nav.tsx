import { UserStatusEnum, useUserInfoStore } from "@/store/userInfoStore"
import { LogoIcon, LoveIcon, MusicIcon } from "../Icon"
import NavItem from "./NavItem"
import { NavItemType } from "./types"
import { useShallow } from "zustand/shallow"
import { useEffect, useState } from "react"
import { getUserPlaylistAPI } from "@/apis/user"

const part1: NavItemType[] = [
  {
    text: "推荐",
    icon: <MusicIcon />,
    href: "/",
  },
]

const Nav: React.FC = () => {
  const { userId, status } = useUserInfoStore(
    useShallow(({ context: { userId, status } }) => ({ userId, status }))
  )

  const [playlists, setPlaylists] = useState<
    { id: number; name: string; coverImgUrl?: string }[]
  >([])

  useEffect(() => {
    async function getUserPlaylist() {
      const {
        data: { playlist },
      } = await getUserPlaylistAPI(userId)

      const lovedPlaylist = { id: playlist[0].id, name: "我喜欢的音乐" }
      const otherPlaylist = playlist
        .slice(1)
        .sort((a, b) => a.createTime - b.createTime)
        .map(({ id, name, coverImgUrl }) => ({ id, name, coverImgUrl }))

      setPlaylists([lovedPlaylist, ...otherPlaylist])
    }

    // if (status === UserStatusEnum.ONLINE) {
    //   getUserPlaylist()
    // }
  }, [userId, status])

  return (
    <div className="py-4 px-6 box-border w-56 h-screen border-r border-r-white/20 bg-slate-100/30">
      <div className="flex justify-start h-10 items-center">
        <div className="size-10 text-primary mr-2">
          <LogoIcon size="full" />
        </div>
        <div className="space-x-1 text-lg">
          <span>网</span>
          <span>易</span>
          <span>云</span>
          <span>音</span>
          <span>乐</span>
        </div>
      </div>
      <div className="mt-10">
        {part1.map((item) => (
          <NavItem {...item} key={item.href} />
        ))}
      </div>
      <div className="h-px bg-white/20 mt-10"></div>
      <div className="mt-6">
        <div className="text-neutral-500 pl-2 box-border text-sm mb-5">
          我的
        </div>
        {playlists.length > 0 && (
          <NavItem
            icon={<LoveIcon />}
            href={`/playlist/${playlists[0].id}`}
            text={playlists[0].name}
          />
        )}
      </div>
      <div className="h-px bg-white/20 mt-10"></div>
      {status === UserStatusEnum.ONLINE && (
        <div className="mt-6">
          <div className="text-neutral-500 pl-2 box-border text-sm mb-5">
            创建的歌单({playlists.length - 1})
          </div>
          <div className="space-y-4">
            {playlists.length > 1 &&
              playlists.slice(1).map((item) => (
                <NavItem
                  key={item.id}
                  icon={
                    <div className="h-8 aspect-square rounded-md overflow-hidden">
                      <img
                        src={item.coverImgUrl + "?param=80y80"}
                        className="h-full w-full"
                      />
                    </div>
                  }
                  href={`/playlist/${item.id}`}
                  text={item.name}
                  className="text-sm"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Nav

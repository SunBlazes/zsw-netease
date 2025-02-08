import { NTabs, NTabPane } from "@/components/NTabs"
import SongsList from "./SongsList"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getPlaylistDetailAPI, PlaylistDetailType } from "@/apis/playlist"
import { EarphoneIcon } from "@/components/Icon"
import { useUserInfoStore } from "@/store/userInfoStore"
import { parseDate } from "@/utils"
import { useShallow } from "zustand/shallow"
import { getMostVibrantColor } from "@/utils/colorThief"
import { useBgStore } from "@/store/bgStore"

const Playlist: React.FC = () => {
  // 歌单ID
  const id = parseInt(useParams<{ id: string }>().id!)

  const setBg = useBgStore((state) => state.setBg)
  const { nickname, avatarUrl } = useUserInfoStore(
    useShallow(({ context: { nickname, avatarUrl } }) => ({
      nickname,
      avatarUrl,
    }))
  )

  // 歌单详情
  const [detail, setDetail] = useState<PlaylistDetailType | null>(null)

  // 根据歌单ID来获取歌单详情
  useEffect(() => {
    // 防止快速切换歌单造成错位
    let ignore = false

    async function reqPlaylistDetail() {
      const {
        data: { playlist },
      } = await getPlaylistDetailAPI(id)

      if (!ignore) {
        setDetail(playlist)
      }
    }

    reqPlaylistDetail()

    return () => {
      ignore = true
    }
  }, [id])

  // 设置全局背景
  useEffect(() => {
    const img = new Image()
    img.src = detail?.coverImgUrl ?? ""
    img.setAttribute("crossOrigin", "")

    const handleImgLoad = () => {
      const color = getMostVibrantColor(img, 10, 1, 0.3, 0.5)
      setBg(`linear-gradient(to bottom, ${color[0]}, 20%, white)`)
    }

    img.addEventListener("load", handleImgLoad)

    return () => {
      img.removeEventListener("load", handleImgLoad)
    }
  }, [detail])

  return (
    <div>
      <div className="h-52 py-2 mb-8">
        <div className="h-full flex">
          <div className="h-full aspect-square relative">
            <img
              className="h-full w-full"
              src={detail ? detail.coverImgUrl + "?param=400y400" : ""}
              alt=""
            />
            <div className="absolute top-3 right-3 text-white text-xs flex items-center">
              <EarphoneIcon />
              <span className="font-bold">{detail?.playCount}</span>
            </div>
          </div>
          <div className="h-full flex flex-col justify-between ml-10">
            <div>
              <div className="text-2xl h-8">{detail?.name}</div>
              <div className="flex mt-4 space-x-3 text-xs items-center text-black/50">
                <div className="size-6 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    className="h-full w-full"
                    src={avatarUrl + "?param=48y48"}
                    alt=""
                  />
                </div>
                <span>{nickname}</span>
                <span>
                  {detail ? parseDate(detail.createTime) + "创建" : ""}
                </span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <NTabs>
        <NTabPane
          tab="歌曲"
          itemKey="1"
          icon={
            <span className="absolute -right-2 -top-1">
              {detail?.playCount}
            </span>
          }
        >
          <SongsList id={id} />
        </NTabPane>
        <NTabPane tab="评论" itemKey="2">
          2
        </NTabPane>
        <NTabPane tab="收藏者" itemKey="3">
          3
        </NTabPane>
      </NTabs>
    </div>
  )
}

export default Playlist

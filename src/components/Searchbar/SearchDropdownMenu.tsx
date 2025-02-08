import { Dropdown } from "@douyinfe/semi-ui"
import { IconSpin } from "@douyinfe/semi-icons"
import { useCallback, useEffect, useState } from "react"
import { GarbageIcon, UpIcon } from "../Icon"
import { SearchDropdownMenuProps } from "./types"
import { addSearchHistoryData } from "@/utils/forge"
import cls from "classnames"
import { getSearchHot } from "@/apis/search"

const items: string[] = [
  "孤独患者",
  "于是",
  "只为你着迷",
  "CRY FOR ME",
  "孤独患者",
  "于是",
  "只为你着迷",
  "CRY FOR ME",
  "孤独患者",
  "于是",
  "只为你着迷",
  "CRY FOR ME",
]

const SearchDropdownMenu: React.FC<SearchDropdownMenuProps> = ({
  setKeywords,
  setClearModalVisible,
  setSearchHistory,
  setDropdownVisible,
  searchHistory,
}) => {
  const [expand, setExpand] = useState(false)
  const [keywordsLoading, setKeywordsLoading] = useState(false)
  const [hotKeywordsArr, setHotKeywordsArr] = useState<string[]>([])

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setExpand((expand) => !expand)
  }, [])

  const handleMenuItemClick = useCallback((keywords: string) => {
    addSearchHistoryData(keywords).then((data) => {
      setSearchHistory(Array.from(data))
      setKeywords(keywords)
    })
  }, [])

  const handleGarbageClick = () => {
    setDropdownVisible(false)
    setClearModalVisible(true)
  }

  // useEffect(() => {
  //   const handleSearchHot = async () => {
  //     setKeywordsLoading(true)
  //     const {
  //       data: {
  //         result: { hots },
  //       },
  //     } = await getSearchHot()
  //     setHotKeywordsArr(hots.map((hot) => hot.first))
  //     setKeywordsLoading(false)
  //   }

  //   handleSearchHot()
  // }, [])

  return (
    <>
      <div className="py-3">
        <Dropdown.Menu
          style={{ width: 310, height: "60vh" }}
          className="scrollbar overflow-y-scroll"
        >
          <div>
            {searchHistory.length > 0 && (
              <>
                <Dropdown.Title className="text-lg flex justify-between items-center">
                  <span>搜索历史</span>
                  <GarbageIcon
                    className="hover:text-slate-600 cursor-pointer"
                    onClick={handleGarbageClick}
                  />
                </Dropdown.Title>
                <div className="px-4 text-slate-400 mt-2 my-2">
                  {searchHistory.slice(0, 7).map((item) => (
                    <div
                      className="inline-block p-1"
                      style={{ maxWidth: "40%" }}
                      key={item}
                    >
                      <div
                        className="text-center text-ellipsis text-nowrap hover:text-slate-600 px-3 leading-6 bg-slate-100 inline-block text-xs rounded-full hover:bg-slate-200 cursor-pointer"
                        onClick={() => handleMenuItemClick(item)}
                        style={{ width: "98%" }}
                      >
                        {item}
                      </div>
                    </div>
                  ))}
                  {searchHistory.slice(7).map((item) => (
                    <div
                      key={item}
                      className="inline-block p-1"
                      style={{ maxWidth: "40%" }}
                    >
                      <div
                        className={
                          (!expand ? "hidden " : "") +
                          "text-center w-full text-ellipsis text-nowrap hover:text-slate-600 px-3 leading-6 bg-slate-100 inline-block text-xs rounded-full hover:bg-slate-200 cursor-pointer"
                        }
                        style={{ width: "98%" }}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        {item}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleExpand}
                    className={cls(
                      {
                        "rotate-180": !expand,
                        hidden: searchHistory.length <= 7,
                      },
                      "align-middle leading-6 overflow-hidden inline-block w-6 bg-slate-100 text-center rounded-full hover:bg-slate-200 cursor-pointer box-border"
                    )}
                  >
                    <UpIcon />
                  </div>
                </div>
              </>
            )}
            <Dropdown.Title className="text-lg mb-3 mt-3">
              热搜榜
            </Dropdown.Title>
            <div
              className={cls("absolute left-1/2 -translate-x-1/2 top-1/3", {
                hidden: !keywordsLoading,
              })}
            >
              <IconSpin className="text-slate-400 text-3xl" spin />
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleMenuItemClick(item)}
                >
                  <div className="flex w-full text-slate-600 py-2 text-[15px]">
                    <span
                      className={
                        "w-1/6 font-bold" + (index < 3 ? " text-primary" : "")
                      }
                    >
                      {index + 1}
                    </span>
                    <span className="w-5/6 overflow-hidden text-nowrap text-ellipsis">
                      {item}
                    </span>
                  </div>
                </Dropdown.Item>
              ))}
            </div>
          </div>
        </Dropdown.Menu>
      </div>
    </>
  )
}

export default SearchDropdownMenu

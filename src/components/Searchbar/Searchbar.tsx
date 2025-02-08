import { ClearIcon, LeftIcon, SearchIcon } from "../Icon"
import { SearchbarProps } from "./types"
import { useState, useCallback, ChangeEvent, useEffect, useRef } from "react"
import { Dropdown } from "@douyinfe/semi-ui"
// import debounce from "@/utils/debounce"
import SearchDropdownMenu from "./SearchDropdownMenu"
import { useNavigate } from "react-router"
import { clearSearchHistoryData, getSearchHistoryData } from "@/utils/forge"
import { NModal } from "../NModal"
import cls from "classnames"
import { IconSpin } from "@douyinfe/semi-icons"

const Searchbar = ({ prefix, suffix }: SearchbarProps) => {
  const [keywords, setKeywords] = useState("")
  const navigate = useNavigate()
  const [placeholder, setPlaceHolder] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [clearModalVisible, setClearModalVisible] = useState(false)
  const [clearModalConfirmLoading, setClearModalConfirmLoading] =
    useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setKeywords(() => e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setKeywords("")
  }, [])

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(-1)
  }, [])

  const handleSetKeywords = (keywords: string) => {
    setKeywords(keywords)
    setDropdownVisible(false)
  }

  const handleClearSearchHistoryData = useCallback(async () => {
    setClearModalConfirmLoading(true)
    await clearSearchHistoryData()
    setSearchHistory([])
    setClearModalConfirmLoading(false)
    setClearModalVisible(false)
  }, [])

  useEffect(() => {
    getSearchHistoryData().then((data) => {
      if (data) setSearchHistory(Array.from(data))
    })
  }, [])

  useEffect(() => {
    window.addEventListener("popstate", (e: any) => {
      console.log(e)
    })
  }, [])

  // useEffect(() => {
  //   getSearchDefault().then(
  //     ({
  //       data: {
  //         data: { showKeyword },
  //       },
  //     }) => {
  //       setPlaceHolder(showKeyword)
  //     }
  //   )
  // }, [])

  return (
    <>
      <Dropdown
        trigger="custom"
        visible={dropdownVisible}
        keepDOM={true}
        render={
          <SearchDropdownMenu
            setKeywords={handleSetKeywords}
            setClearModalVisible={setClearModalVisible}
            setSearchHistory={setSearchHistory}
            setDropdownVisible={setDropdownVisible}
            searchHistory={searchHistory}
          />
        }
        spacing={12}
        getPopupContainer={() => rootRef.current as HTMLDivElement}
        onClickOutSide={() => setDropdownVisible(false)}
        zIndex={1}
      >
        <div className="flex relative h-10" ref={rootRef}>
          <div
            className="w-10 leading-6 text-[22px] text-center hover:text-slate-400 hover:bg-slate-100 cursor-pointer text-slate-300 rounded-lg h-full p-2 box-border border border-gray-300"
            onClick={handleBack}
          >
            <LeftIcon size="extra-large" className="text-slate-600" />
          </div>
          <div
            className="ml-2 group w-64 border border-gray-300 rounded-lg flex items-center py-1 px-4 box-border justify-around"
            onClick={() => setDropdownVisible(true)}
          >
            {prefix ? (
              prefix
            ) : (
              <SearchIcon
                size="large"
                className="text-gray-400 font-bold cursor-pointer hover:text-slate-500"
              />
            )}
            <input
              type="text"
              onChange={handleInputChange}
              className="outline-none text-slate-500 w-40 text-sm bg-transparent"
              value={keywords}
              placeholder={placeholder}
            />
            {suffix ? (
              suffix
            ) : (
              <ClearIcon
                size="large"
                className="text-slate-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-slate-500"
                onClick={handleClear}
              />
            )}
          </div>
        </div>
      </Dropdown>
      <NModal
        visible={clearModalVisible}
        onCancel={() => setClearModalVisible(false)}
      >
        <div className="text-center">
          <div className="text-2xl text-slate-600 font-bold">
            确定清空全部历史记录吗
          </div>
          <div
            className="text-lg w-1/2 mx-auto mt-14 bg-primary/75 py-2 text-white rounded-full cursor-pointer hover:bg-primary"
            onClick={handleClearSearchHistoryData}
          >
            <IconSpin
              spin={true}
              className={cls({ hidden: !clearModalConfirmLoading }, "mr-2")}
            />
            <span>确认</span>
          </div>
        </div>
      </NModal>
    </>
  )
}

export default Searchbar

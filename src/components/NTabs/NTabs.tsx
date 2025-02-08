import { Children, useCallback, useEffect, useMemo, useState } from "react"
import { NTabItemProps, NTabsProps } from "./types"
import NTabbar from "./NTabbar"
import NTabsContext from "./ntabs-context"

const NTabs: React.FC<NTabsProps> = ({ children, onTabClick, ...props }) => {
  const [activeKey, setActiveKey] = useState(props.activeKey)

  const getTabbarList = useCallback(
    (
      children: React.ReactNode
    ): Array<Omit<NTabItemProps, "isActive"> | undefined> => {
      return Children.map(children, (child: any) => {
        if (child) {
          const { tab, itemKey, icon } = child.props
          return { tab, itemKey, icon }
        }
        return undefined
      })
    },
    []
  )
  const getDefaultActiveKey = useCallback(
    (children: React.ReactNode): string | undefined => {
      let activeKey = ""
      Children.forEach(children, (child: any) => {
        if (!activeKey) {
          activeKey = child.props.itemKey
        }
      })

      return activeKey ? activeKey : undefined
    },
    []
  )

  const list = useMemo(() => {
    return getTabbarList(children).filter((pane) => pane !== undefined)
  }, [children])

  const handleTabClick = useCallback((itemKey: string, e: any) => {
    setActiveKey(itemKey)
    onTabClick && onTabClick(itemKey, e)
  }, [])

  useEffect(() => {
    if (!activeKey || !list.map((item) => item.itemKey).includes(activeKey)) {
      setActiveKey(getDefaultActiveKey(children))
    }
  }, [children])

  return (
    <div>
      <NTabbar
        list={list}
        activeKey={activeKey}
        handleTabClick={handleTabClick}
      />
      <NTabsContext.Provider value={{ activeKey }}>
        <div className="pt-4">{children}</div>
      </NTabsContext.Provider>
    </div>
  )
}

export default NTabs

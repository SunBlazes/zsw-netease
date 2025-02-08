export interface NTabsProps {
  children?: React.ReactNode
  activeKey?: string
  onTabClick?: (itemKey: string, e: any) => void
}

export interface NTabPaneProps {
  tab: string
  itemKey: string
  children?: React.ReactNode
  icon?: React.ReactNode
}

export interface NTabbarProps {
  activeKey?: string
  list: Omit<NTabItemProps, "isActive" | "itemStyle" | "activeStyle">[]
  handleTabClick: (itemKey: string, e: any) => void
}

export interface NTabItemProps {
  tab: string
  itemKey: string
  isActive: boolean
  onClick: (itemKey: string, e: any) => void
  icon?: React.ReactNode
}

export interface NTabContextType {
  activeKey?: string
}

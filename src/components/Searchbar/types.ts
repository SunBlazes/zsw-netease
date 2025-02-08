import React from "react"

export interface SearchbarProps {
  prefix?: React.ReactElement
  suffix?: React.ReactElement
}

export interface SearchDropdownMenuProps {
  searchHistory: string[]
  setKeywords: (keywords: string) => void
  setClearModalVisible: (visible: boolean) => void
  setSearchHistory: (history: string[]) => void
  setDropdownVisible: (visible: boolean) => void
}

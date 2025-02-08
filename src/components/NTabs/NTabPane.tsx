import { useContext } from "react"
import { NTabPaneProps } from "./types"
import NTabsContext from "./ntabs-context"

const NTabPane: React.FC<NTabPaneProps> = ({ children, itemKey }) => {
  const context = useContext(NTabsContext)

  return <div>{itemKey === context.activeKey && children}</div>
}

export default NTabPane

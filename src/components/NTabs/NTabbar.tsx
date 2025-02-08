import NTabItem from "./NTabItem"
import { NTabbarProps } from "./types"

const NTabbar: React.FC<NTabbarProps> = ({
  list,
  activeKey,
  handleTabClick,
}) => {
  return (
    <div className="flex space-x-5">
      {list.map((item) => (
        <NTabItem
          key={item.itemKey}
          {...item}
          isActive={activeKey === item.itemKey}
          onClick={handleTabClick}
        />
      ))}
    </div>
  )
}

export default NTabbar

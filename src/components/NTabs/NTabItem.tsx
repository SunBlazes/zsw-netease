import { NTabItemProps } from "./types"
import cls from "classnames"

const NTabItem: React.FC<NTabItemProps> = ({
  tab,
  itemKey,
  isActive,
  onClick,
  icon,
}) => {
  return (
    <div
      className={cls("text-black/50 text-md relative h-8", {
        ["text-stone-700 font-bold after after:absolute after:w-4 after:h-1 after:bg-primary after:bottom-0 after:left-1/2 after:-translate-x-1/2"]:
          isActive,
      })}
    >
      <span className="cursor-pointer" onClick={(e) => onClick(itemKey, e)}>
        {tab}
      </span>
      <div
        className={cls("text-slate-400 text-xs", {
          ["text-stone-700 font-bold"]: isActive,
        })}
      >
        {icon}
      </div>
    </div>
  )
}

export default NTabItem

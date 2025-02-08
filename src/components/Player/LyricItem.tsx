import { LyricItemProps } from "./types"
import cls from "classnames"

const LyricItem: React.FC<LyricItemProps> = ({ content, isActive }) => {
  return (
    <div className={cls({ "text-white text-2xl": isActive }, "leading-[3rem]")}>
      {content}
    </div>
  )
}

export default LyricItem

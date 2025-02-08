import { useLocation, useNavigate } from "react-router-dom"
import { NavItemType } from "./types"
import cls from "classnames"

const NavItem: React.FC<NavItemType> = ({ text, icon, className, href }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const _className = cls(
    "box-border cursor-pointer overflow-hidden px-2 py-1 rounded-lg items-center flex",
    className,
    href === location.pathname
      ? "text-white bg-primary"
      : "text-neutral-500 hover:bg-slate-100"
  )

  const handleItemClick = (e: React.MouseEvent) => {
    navigate(href)

    e.stopPropagation()
    return false
  }

  return (
    <div className={_className} onClick={handleItemClick}>
      <div className="mr-3 fontsize-zero">{icon}</div>
      <span>{text}</span>
    </div>
  )
}

export default NavItem

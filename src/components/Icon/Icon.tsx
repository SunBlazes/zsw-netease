import { noop } from "@/utils"
import { IconProps, IconSizeType } from "./types"
import cls from "classnames"

const sizeMappingClassname: Record<IconSizeType, string> = {
  "extra-small": "size-2",
  small: "size-3",
  default: "size-4",
  large: "size-5",
  "extra-large": "size-6",
  full: "w-full h-full",
}

const Icon = ({
  children,
  style = {},
  className = "",
  onClick = noop,
  size = "default",
}: IconProps) => {
  const _onClick = onClick || noop
  const _className = cls(
    className,
    sizeMappingClassname[size],
    "inline-block cursor-pointer group"
  )

  return (
    <span className={_className} style={style} onClick={_onClick}>
      {children}
    </span>
  )
}

export default Icon

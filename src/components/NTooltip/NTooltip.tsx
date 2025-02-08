import { useMemo } from "react"
import { NTooltipProps } from "./types"
import cls from "classnames"

const NTooltip: React.FC<NTooltipProps> = ({
  children,
  content,
  className,
  position = "top",
}) => {
  const containerClassName = useMemo(() => {
    switch (position) {
      case "top":
        return "bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2"
      case "bottom":
        return "top-[calc(100%+6px)] left-1/2 -translate-x-1/2"
      case "left":
        return "right-[calc(100%+6px)] top-1/2 -translate-y-1/2"
      case "right":
        return "left-[calc(100%+6px)] top-1/2 -translate-y-1/2"
    }
  }, [position])

  const triClassName = useMemo(() => {
    switch (position) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-t-white"
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[8px] border-b-white"
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[8px] border-l-white"
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[8px] border-r-white"
    }
  }, [position])

  return (
    <div className="relative group h-fit w-fit">
      {children}
      <div
        className={cls(
          "invisible group-hover:animate-[tooltipFadeIn_0.3s_cubic-bezier(0.52,0.03,0.00,1.00)_forwards] absolute flex p-2 bg-white rounded-md",
          containerClassName,
          className
        )}
        style={{ boxShadow: "0 0 15px 3px rgba(0,0,0,.1)" }}
      >
        {content}
        <div
          className={cls("w-0 h-0 border-transparent absolute", triClassName)}
        ></div>
      </div>
    </div>
  )
}

export default NTooltip

import { useEffect, useMemo, useRef } from "react"
import { NSideSheetProps } from "./types"
import cls from "classnames"
import {
  NSIDE_SHEET_ENTER_BOTTOM,
  NSIDE_SHEET_ENTER_LEFT,
  NSIDE_SHEET_ENTER_RIGHT,
  NSIDE_SHEET_ENTER_TOP,
  NSIDE_SHEET_LEAVE_BOTTOM,
  NSIDE_SHEET_LEAVE_LEFT,
  NSIDE_SHEET_LEAVE_RIGHT,
  NSIDE_SHEET_LEAVE_TOP,
  NSIDE_SHEET_MASK_ENTER,
  NSIDE_SHEET_MASK_LEAVE,
} from "@/constants/animate"

const NSideSheet: React.FC<NSideSheetProps> = ({
  visible,
  position = "right",
  className,
  mask = true,
  children,
  onClose,
}) => {
  const rootRef = useRef<HTMLDivElement>(null)

  const _className = useMemo(() => {
    if (className) return className

    switch (position) {
      case "right":
      case "left":
        return "h-full"
      default:
        return "w-full"
    }
  }, [position, className])

  const rootAnimationClassName = useMemo(() => {
    switch (position) {
      case "right":
        return cls(visible ? NSIDE_SHEET_ENTER_RIGHT : NSIDE_SHEET_LEAVE_RIGHT)
      case "left":
        return cls(visible ? NSIDE_SHEET_ENTER_LEFT : NSIDE_SHEET_LEAVE_LEFT)
      case "top":
        return cls(visible ? NSIDE_SHEET_ENTER_TOP : NSIDE_SHEET_LEAVE_TOP)
      default:
        return cls(
          visible ? NSIDE_SHEET_ENTER_BOTTOM : NSIDE_SHEET_LEAVE_BOTTOM
        )
    }
  }, [position, visible])

  const handleMaskClick = (e: React.MouseEvent) => {
    onClose && onClose(e.nativeEvent)

    e.stopPropagation()
    return false
  }

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (!visible) {
      rootRef.current!.classList.add("hidden")
    }

    e.stopPropagation()
    return false
  }

  useEffect(() => {
    if (visible) {
      rootRef.current!.classList.remove("hidden")
    }
  }, [visible])

  return (
    <div
      className="fixed left-0 right-0 top-0 bottom-0 hidden z-[1000]"
      onAnimationEnd={handleAnimationEnd}
      ref={rootRef}
    >
      <div
        className={cls(
          "absolute bg-white z-[1001]",
          `${position}-0`,
          _className,
          rootAnimationClassName,
          {
            "shadow-[0_0_10px_1px_rgba(0,0,0,.1)]": !mask,
          }
        )}
      >
        {children}
      </div>
      <div
        className={cls(
          "absolute left-0 right-0 top-0 bottom-0 z-[1000]",
          mask
            ? "bg-[var(--semi-color-overlay-bg)] " +
                (visible ? NSIDE_SHEET_MASK_ENTER : NSIDE_SHEET_MASK_LEAVE)
            : ""
        )}
        onClick={handleMaskClick}
      ></div>
    </div>
  )
}

export default NSideSheet

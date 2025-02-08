import { merge, noop } from "@/utils"
import { NModalProps } from "./types"
import cls from "classnames"
import { CSSProperties, useCallback, useEffect, useRef } from "react"
import {
  NMODAL_ENTER,
  NMODAL_LEAVE,
  NMODAL_OVERLAY_LEAVE,
  NMODAL_OVERLAY_ENTER,
} from "@/constants/animate"
import { CloseIcon } from "@/components/Icon"
import { createPortal } from "react-dom"

const NModal: React.FC<NModalProps> = (props) => {
  const {
    children: content,
    visible,
    mask = true,
    maskCloseable = true,
    className,
    style = {},
    onCancel = noop,
    width = 448,
    motion = true,
    centered = true,
  } = props

  const _className = cls(
    className,
    "fixed left-0 right-0 top-0 bottom-0 hidden"
  )
  const _style = merge<CSSProperties, CSSProperties>({ zIndex: 1000 }, style)
  const rootRef = useRef<HTMLDivElement>(null)
  const centeredClassname = "top-1/2 -translate-y-1/2"

  useEffect(() => {
    if (visible) {
      rootRef.current?.classList.remove("hidden")
    }
  }, [visible])

  const handleMaskClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (maskCloseable) onCancel(e)
  }, [])

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel(e)
  }, [])

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent, visible: boolean) => {
      e.stopPropagation()
      if (!visible) {
        rootRef.current?.classList.add("hidden")
      }
    },
    []
  )

  return (
    <>
      {createPortal(
        <div
          className={_className}
          style={_style}
          onAnimationEnd={(e) => handleAnimationEnd(e, visible)}
          ref={rootRef}
        >
          <div
            className={cls(
              "relative bg-white px-6 py-12 mx-auto rounded-xl z-[1001]",
              {
                [NMODAL_ENTER]: motion && visible,
                [NMODAL_LEAVE]: motion && !visible,
                [centeredClassname]: centered,
              }
            )}
            style={{ width }}
          >
            <div
              className="font-bold text-xl absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
              onClick={handleCloseClick}
            >
              <CloseIcon />
            </div>
            {content}
          </div>
          <div
            className={cls(
              "absolute left-0 right-0 top-0 bottom-0 z-[1000] bg-[var(--semi-color-overlay-bg)]",
              {
                [NMODAL_OVERLAY_ENTER]: motion && mask && visible,
                [NMODAL_OVERLAY_LEAVE]: motion && mask && !visible,
                hidden: !visible,
              }
            )}
            onClick={handleMaskClick}
          ></div>
        </div>,
        document.body
      )}
    </>
  )
}

export default NModal

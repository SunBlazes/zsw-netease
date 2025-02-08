import { useCallback, useEffect, useRef, useState } from "react"
import { NSliderProps } from "./types"
import cls from "classnames"
import { noop } from "@/utils"
import { useEvent } from "@/hooks/useEvent"

const NSlider: React.FC<NSliderProps> = ({
  onChange,
  onAfterChange,
  min = 0,
  max = 100,
  defaultValue = -1,
  value = -1,
  disabled = false,
  railStyle = {},
  thumbStyle = {},
  vertical = false,
}) => {
  const isDownRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [dragVisible, setDragVisible] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDownRef.current = true

    e.stopPropagation()
    return false
  }, [])

  const mouseEventHandler = useEvent(
    (val: MouseEvent | number, handler?: Function) => {
      const dragEl = dragRef.current!
      const progressEl = progressRef.current!
      const containerEl = containerRef.current!

      const width = containerEl.clientWidth
      const height = containerEl.clientHeight

      let offset = 0
      if (!(typeof val === "number")) {
        if (!vertical) {
          offset = val.pageX - progressEl.getBoundingClientRect().left
          offset = offset < 0 ? 0 : offset > width ? width : offset
        } else {
          offset = progressEl.getBoundingClientRect().bottom - val.pageY
          offset = offset < 0 ? 0 : offset > height ? height : offset
        }
      } else {
        if (!vertical) {
          offset = ((val - min) / (max - min)) * width
        } else {
          offset = ((val - min) / (max - min)) * height
        }
      }

      const value = !vertical
        ? min + (offset / width) * (max - min)
        : min + (offset / height) * (max - min)

      handler && handler(value)

      if (!vertical) {
        progressEl.style.width = offset + "px"
        dragEl.style.left = offset + "px"
      } else {
        progressEl.style.height = offset + "px"
        dragEl.style.bottom = offset + "px"
      }
    }
  )

  const handleProgressClick = useEvent((e: React.MouseEvent) => {
    mouseEventHandler(e.nativeEvent, onAfterChange)

    e.stopPropagation()
    return false
  })

  const handleProgressMouseDown = useEvent((e: React.MouseEvent) => {
    isDownRef.current = true
    mouseEventHandler(e.nativeEvent, onChange)

    e.stopPropagation()
    return false
  })

  const judgeMouseInContainer = useCallback((e: MouseEvent) => {
    const { pageX, pageY } = e
    const containerEl = containerRef.current!

    const { left, right, top, bottom } = containerEl.getBoundingClientRect()

    return pageX >= left && pageX <= right && pageY >= top && pageY <= bottom
  }, [])

  useEffect(() => {
    defaultValue !== -1 && mouseEventHandler(defaultValue, onAfterChange)
  }, [defaultValue, onAfterChange])

  useEffect(() => {
    value !== -1 && mouseEventHandler(value)
  }, [value])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDownRef.current) {
        mouseEventHandler(e, onChange)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (isDownRef.current) {
        mouseEventHandler(e, onAfterChange)
        isDownRef.current = false
        !judgeMouseInContainer(e) && setDragVisible(false)
      }
    }

    if (!disabled) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      if (!disabled) {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [disabled, onChange, onAfterChange])

  return (
    <div
      className={cls(
        "flex justify-center relative group cursor-pointer",
        { "cursor-not-allowed": disabled },
        vertical ? "h-full w-4" : "w-full h-4 flex-col"
      )}
      ref={containerRef}
      onMouseEnter={disabled ? noop : () => setDragVisible(true)}
      onMouseLeave={
        disabled ? noop : () => !isDownRef.current && setDragVisible(false)
      }
      onMouseDown={disabled ? noop : handleProgressMouseDown}
      onClick={disabled ? noop : handleProgressClick}
    >
      <div
        className={cls(
          "bg-slate-200 rounded-full relative",
          vertical ? "h-full w-1" : "w-full h-1"
        )}
        style={railStyle}
      >
        <div
          className={cls(
            "absolute rounded-full bg-primary",
            vertical ? "bottom-0 w-full" : "left-0 h-full"
          )}
          ref={progressRef}
          style={thumbStyle}
        ></div>
      </div>
      <div
        className={cls(
          "absolute rounded-full bg-white aspect-square cursor-pointer",
          {
            hidden: !dragVisible,
            "cursor-not-allowed": disabled,
          },
          vertical
            ? "w-3 left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"
            : "h-3 top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
        )}
        style={{ boxShadow: "0 0 10px 1px rgba(0,0,0,0.2)" }}
        onMouseDown={disabled ? noop : handleMouseDown}
        ref={dragRef}
      ></div>
    </div>
  )
}

export default NSlider

import React, { CSSProperties } from "react"

export interface NModalProps {
  children: React.ReactNode
  visible: boolean
  mask?: boolean
  maskCloseable?: boolean
  className?: string
  style?: CSSProperties
  onCancel?: (e: any) => any | Promise<any>
  width?: number
  motion?: boolean
  centered?: boolean
}

export interface NSideSheetProps {
  visible: boolean
  mask?: boolean
  position?: "top" | "bottom" | "left" | "right"
  className?: string
  children?: React.ReactNode
  onClose?: (e: any) => any
}

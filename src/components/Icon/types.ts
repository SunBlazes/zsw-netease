export type IconSizeType =
  | "extra-small"
  | "small"
  | "default"
  | "large"
  | "extra-large"
  | "full"

export interface IconProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler
  size?: IconSizeType
}

export interface _IconProps extends Omit<IconProps, "children"> {
  overlay?: boolean
}

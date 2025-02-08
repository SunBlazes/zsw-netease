export interface NSliderProps {
  defaultValue?: number
  value?: number
  min?: number
  max?: number
  railStyle?: React.CSSProperties
  thumbStyle?: React.CSSProperties
  disabled?: boolean
  vertical?: boolean
  onChange?: (value: number) => void
  onAfterChange?: (value: number) => void
}

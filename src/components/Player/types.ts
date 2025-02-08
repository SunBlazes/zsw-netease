export interface PlayerProps {
  visible: boolean
  ct: number
  PlayerInteraction?: React.ReactNode
  PlayerSchedule: React.ReactNode
  PlayerSlider: React.ReactNode
  PlayerConsole: React.ReactNode
  onClose: (e: any) => any
}

export interface LyricListProps {
  ct: number
  lyric: string
}

export interface LyricItemProps {
  content: string
  isActive: boolean
}

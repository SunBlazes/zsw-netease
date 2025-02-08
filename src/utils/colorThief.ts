// @ts-ignore
import ColorThief from "colorthief"

const colorThief = new ColorThief()

function parse(rgb: [number, number, number]) {
  return `rgb(${rgb.join(",")})`
}

export function getMainColor(img: HTMLImageElement) {
  return parse(colorThief.getColor(img) as [number, number, number])
}

export function getMostVibrantColor(
  img: HTMLImageElement,
  nums = 10,
  top = 1,
  lightnessMin = 0.3,
  lightnessMax = 0.7
) {
  const palette = colorThief.getPalette(img, nums) as Array<
    [number, number, number]
  >

  const sortedPalette = palette
    .map((color) => {
      const [r, g, b] = color
      const { s, l } = rgbToHsl(r, g, b)
      return { color, s, l }
    })
    .sort((a, b) => b.s - a.s)

  const mostVibrantColors = sortedPalette
    .filter(({ l }) => l > lightnessMin && l < lightnessMax)
    .slice(0, top)
    .map(({ color }) => parse(color)) // 只提取颜色值

  return mostVibrantColors
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return { h, s, l }
}

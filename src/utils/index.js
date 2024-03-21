export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t

export const getPiramidalIndex = (array, index) =>
  array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  )

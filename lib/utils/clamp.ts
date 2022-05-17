export function clamp(value: number, range: [number, number] = [0, 1]) {
  const min = range[0]
  const max = range[1]

  if (min > value) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}
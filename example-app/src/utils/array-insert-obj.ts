export function arrayInsertObj<T extends { id: number }>(
  newItem: T,
  items: T[],
  index?: number
) {
  const idx = index ? index : items.length
  const start = items.slice(0, idx)
  const end = items.slice(idx)
  // console.log({ newItem, items, index, idx, start, end })
  return [...start, newItem, ...end]
}

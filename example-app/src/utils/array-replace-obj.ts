import { arrayInsertObj } from './array-insert-obj'

export function arrayReplaceObj<T extends { id: number }>(
  newItem: T,
  index: number,
  items: T[]
) {
  const filteredItems = items.filter((i) => i.id !== newItem.id)
  if (filteredItems.length !== items.length - 1) {
    throw new Error(`Item with id=${index} was not found`)
  }
  return arrayInsertObj(newItem, filteredItems, index)
}

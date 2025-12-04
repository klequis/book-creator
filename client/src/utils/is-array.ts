import { log } from './log'

export function assertIsArray(name: string, value: any):void {
  const result = Array.isArray(value)
  if (!result) {
    log('red', `${name}:isArray`, { value, result })
    throw new Error(`${name} is not an array`)
  }
}
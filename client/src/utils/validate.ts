import { log } from './log'

/**
 * Validate if the given value is a finite number.
 * @param value - The value to validate.
 * @returns True if the value is a finite number, false otherwise.
 */
export function validateNumber(value: any): boolean {
  // logFn("validateNumber", `value: ${value} (${typeof value})`);
  return typeof value === 'number' && isFinite(value)
}

export function isNumber(v: FormDataEntryValue | null) {
  const r = !isNaN(Number(v))
  log('blue', '_IsNumber|v:', { v, x: r })
  return r
}

export function isBoolean(v: FormDataEntryValue | null) {
  const r = v === 'true' || v === 'false'
  log('blue', '_isBoolean|v:', { v, x: r })
  return r
}

export function toBoolean(v: FormDataEntryValue | null) {
  return v === 'true' ? true : false
}


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { assertIsArray } from '../is-array'

describe('isArray utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.log for isArray function
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should not throw error for valid arrays', () => {
    expect(() => assertIsArray('test', [])).not.toThrow()
    expect(() => assertIsArray('test', [1, 2, 3])).not.toThrow()
    expect(() => assertIsArray('test', ['a', 'b'])).not.toThrow()
  })

  it('should throw error for non-arrays', () => {
    expect(() => assertIsArray('test', null)).toThrow()
    expect(() => assertIsArray('test', undefined)).toThrow()
    expect(() => assertIsArray('test', 'string')).toThrow()
    expect(() => assertIsArray('test', 123)).toThrow()
    expect(() => assertIsArray('test', {})).toThrow()
  })

  it('should include the label in error message', () => {
    expect(() => assertIsArray('myData', 'not-array')).toThrow(/myData/)
  })
})
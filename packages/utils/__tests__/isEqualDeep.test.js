import { isEqualDeep } from '..'

describe('isEqualDeep', () => {
  // Test cases for comparing primitive values
  it('should return true for equal numbers', () => {
    expect(isEqualDeep(42, 42)).toBe(true)
  })

  it('should return true for equal strings', () => {
    expect(isEqualDeep('hello', 'hello')).toBe(true)
  })

  it('should return true for equal booleans', () => {
    expect(isEqualDeep(true, true)).toBe(true)
  })

  it('should return false for different primitive values', () => {
    expect(isEqualDeep(42, '42')).toBe(false)
  })

  // Test cases for comparing simple objects
  it('should return true for equal simple objects', () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { a: 1, b: { c: 2 } }
    expect(isEqualDeep(obj1, obj2)).toBe(true)
  })

  it('should return false for different simple objects', () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { a: 1, b: { c: 3 } }
    expect(isEqualDeep(obj1, obj2)).toBe(false)
  })

  // Add more test cases for arrays, nested objects, etc.
  // ...

  // Test cases for comparing null and undefined
  it('should return false for null and undefined', () => {
    expect(isEqualDeep(null, undefined)).toBe(false)
  })

  // Test cases for comparing arrays
  it('should return true for equal arrays', () => {
    const arr1 = [1, 2, [3, 4]]
    const arr2 = [1, 2, [3, 4]]
    expect(isEqualDeep(arr1, arr2)).toBe(true)
  })

  it('should return false for different arrays', () => {
    const arr1 = [1, 2, [3, 4]]
    const arr2 = [1, 2, [3, 5]]
    expect(isEqualDeep(arr1, arr2)).toBe(false)
  })
})

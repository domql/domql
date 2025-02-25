import { removeFromObject, removeFromArray } from '..'

describe('removeFromObject', () => {
  it('removes a single property from an object', () => {
    const obj = { a: 1, b: 2 }
    const result = removeFromObject(obj, 'a')
    expect(result).toEqual({ b: 2 })
  })

  it('removes multiple properties from an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = removeFromObject(obj, ['a', 'c'])
    expect(result).toEqual({ b: 2 })
  })

  it('returns the original object if props is an empty array', () => {
    const obj = { a: 1, b: 2 }
    const result = removeFromObject(obj, [])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('returns the same object if props is null or undefined', () => {
    const obj = { a: 1, b: 2 }
    expect(removeFromObject(obj, null)).toEqual({ a: 1, b: 2 })
    expect(removeFromObject(obj, undefined)).toEqual({ a: 1, b: 2 })
  })
})

describe('removeFromArray', () => {
  it('removes the item at the specified index using a number index', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = removeFromArray(arr, 2)
    expect(result).toEqual([1, 2, 4, 5])
  })

  it('throws an error for an invalid number index', () => {
    const arr = [1, 2, 3]
    expect(() => removeFromArray(arr, -1)).toThrow('Invalid index')
    expect(() => removeFromArray(arr, 3)).toThrow('Invalid index')
  })

  it('removes the item at the specified index using a string index', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = removeFromArray(arr, '2')
    expect(result).toEqual([1, 2, 4, 5])
  })

  it('throws an error for an invalid string index', () => {
    const arr = [1, 2, 3]
    expect(() => removeFromArray(arr, 'foo')).toThrow('Invalid index')
    expect(() => removeFromArray(arr, '3')).toThrow('Invalid index')
  })

  it('throws an error for an invalid index type', () => {
    const arr = [1, 2, 3]
    expect(() => removeFromArray(arr, {})).toThrow('Invalid index')
    expect(() => removeFromArray(arr, null)).toThrow('Invalid index')
    expect(() => removeFromArray(arr, undefined)).toThrow('Invalid index')
  })
})

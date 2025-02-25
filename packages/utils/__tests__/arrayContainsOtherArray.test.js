import { arrayContainsOtherArray } from '..'

describe('arrayContainsOtherArray', () => {
  it('should return true if the first array contains all elements in the second array', () => {
    const arr1 = [1, 2, 3, 4, 5]
    const arr2 = [2, 4, 5]

    expect(arrayContainsOtherArray(arr1, arr2)).toBe(true)
  })

  it('should return false if the first array does not contain all elements in the second array', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5]

    expect(arrayContainsOtherArray(arr1, arr2)).toBe(false)
  })

  it('should return true if the second array is empty', () => {
    const arr1 = [1, 2, 3]
    const arr2 = []

    expect(arrayContainsOtherArray(arr1, arr2)).toBe(true)
  })

  it('should return true if both arrays are empty', () => {
    const arr1 = []
    const arr2 = []

    expect(arrayContainsOtherArray(arr1, arr2)).toBe(true)
  })

  it('should return true if both arrays contain the same elements', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]

    expect(arrayContainsOtherArray(arr1, arr2)).toBe(true)
  })
})

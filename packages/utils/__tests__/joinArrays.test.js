import { joinArrays } from '..'

describe('joinArrays', () => {
  test('returns a single array containing all elements from input arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    const arr3 = [7, 8, 9]
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const result = joinArrays(arr1, arr2, arr3)

    expect(result).toEqual(expected)
  })

  test('returns an empty array if no input arrays are passed', () => {
    const expected = []

    const result = joinArrays()

    expect(result).toEqual(expected)
  })
})

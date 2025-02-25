import { swapItemsInArray } from '..'

describe('swapItemsInArray', () => {
  it('swaps two items in the middle of the array', () => {
    const arr = [1, 2, 3, 4, 5]
    swapItemsInArray(arr, 2, 3)
    expect(arr).toEqual([1, 2, 4, 3, 5])
  })

  it('swaps the first and last items in the array', () => {
    const arr = ['apple', 'banana', 'cherry']
    swapItemsInArray(arr, 0, 2)
    expect(arr).toEqual(['cherry', 'banana', 'apple'])
  })

  it('swaps two identical items in the array', () => {
    const arr = ['dog', 'cat', 'cat', 'bird']
    swapItemsInArray(arr, 1, 2)
    expect(arr).toEqual(['dog', 'cat', 'cat', 'bird'])
  })

  it('does not change the array when swapping an index with itself', () => {
    const arr = ['apple', 'banana', 'cherry']
    swapItemsInArray(arr, 1, 1)
    expect(arr).toEqual(['apple', 'banana', 'cherry'])
  })

  it('does not change the array when swapping indices that are out of bounds', () => {
    const arr = ['apple', 'banana', 'cherry']
    swapItemsInArray(arr, -1, 3)
    expect(arr).toEqual(['apple', 'banana', 'cherry'])
  })
})

import {
  arrayContainsOtherArray,
  getFrequencyInArray,
  removeFromArray,
  swapItemsInArray,
  joinArrays,
  unstackArrayOfObjects,
  cutArrayBeforeValue,
  cutArrayAfterValue,
  removeValueFromArray,
  removeValueFromArrayAll,
  addItemAfterEveryElement,
  reorderArrayByValues,
  arraysEqual,
  filterArrays,
  checkIfStringIsInArray,
  removeDuplicatesInArray
} from '../array.js'

describe('Array Utils', () => {
  describe('arrayContainsOtherArray', () => {
    it('should return true when array contains all elements', () => {
      expect(arrayContainsOtherArray([1, 2, 3, 4], [2, 4])).toBe(true)
    })

    it('should return false when array does not contain all elements', () => {
      expect(arrayContainsOtherArray([1, 2, 3], [2, 4])).toBe(false)
    })

    it('should handle empty arrays', () => {
      expect(arrayContainsOtherArray([1, 2, 3], [])).toBe(true)
      expect(arrayContainsOtherArray([], [1])).toBe(false)
    })
  })

  describe('getFrequencyInArray', () => {
    it('should count frequency of a value', () => {
      expect(getFrequencyInArray([1, 2, 2, 3, 2], 2)).toBe(3)
    })

    it('should return 0 for non-existent value', () => {
      expect(getFrequencyInArray([1, 2, 3], 4)).toBe(0)
    })

    it('should work with different types', () => {
      expect(getFrequencyInArray(['a', 'b', 'a'], 'a')).toBe(2)
    })
  })

  describe('removeFromArray', () => {
    it('should remove element at index', () => {
      const arr = [1, 2, 3]
      expect(removeFromArray(arr, 1)).toEqual([1, 3])
    })

    it('should throw error for invalid index', () => {
      expect(() => removeFromArray([1, 2], 5)).toThrow('Invalid index')
    })
  })

  describe('swapItemsInArray', () => {
    it('should swap two elements', () => {
      const arr = [1, 2, 3]
      swapItemsInArray(arr, 0, 2)
      expect(arr).toEqual([3, 2, 1])
    })
  })

  describe('joinArrays', () => {
    it('should join multiple arrays', () => {
      expect(joinArrays([1, 2], [3, 4], [5])).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle empty arrays', () => {
      expect(joinArrays([], [1], [])).toEqual([1])
    })
  })

  describe('cutArrayBeforeValue and cutArrayAfterValue', () => {
    const arr = [1, 2, 3, 4, 5]

    it('should cut array before value', () => {
      expect(cutArrayBeforeValue(arr, 3)).toEqual([1, 2])
    })

    it('should cut array after value', () => {
      expect(cutArrayAfterValue(arr, 3)).toEqual([4, 5])
    })

    it('should handle non-existent values', () => {
      expect(cutArrayBeforeValue(arr, 6)).toEqual(arr)
      expect(cutArrayAfterValue(arr, 6)).toEqual(arr)
    })
  })

  describe('removeValueFromArray and removeValueFromArrayAll', () => {
    it('should remove first occurrence of value', () => {
      expect(removeValueFromArray([1, 2, 2, 3], 2)).toEqual([1, 2, 3])
    })

    it('should remove all occurrences of value', () => {
      expect(removeValueFromArrayAll([1, 2, 2, 3], 2)).toEqual([1, 3])
    })
  })

  describe('addItemAfterEveryElement', () => {
    it('should add item between elements', () => {
      expect(addItemAfterEveryElement([1, 2, 3], 'x')).toEqual([
        1,
        'x',
        2,
        'x',
        3
      ])
    })

    it('should handle empty array', () => {
      expect(addItemAfterEveryElement([], 'x')).toEqual([])
    })
  })

  describe('reorderArrayByValues', () => {
    it('should reorder array by moving value before target', () => {
      expect(reorderArrayByValues([1, 2, 3, 4], 4, 2)).toEqual([1, 4, 2, 3])
    })

    it('should handle non-existent values', () => {
      expect(reorderArrayByValues([1, 2, 3], 4, 2)).toEqual([1, 2, 3])
    })
  })

  describe('arraysEqual', () => {
    it('should return true for identical arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    })

    it('should return false for different arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 3, 2])).toBe(false)
    })

    it('should return false for arrays of different lengths', () => {
      expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false)
    })
  })

  describe('filterArrays', () => {
    it('should filter out excluded values', () => {
      expect(filterArrays([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
    })

    it('should handle empty arrays', () => {
      expect(filterArrays([], [1, 2])).toEqual([])
      expect(filterArrays([1, 2], [])).toEqual([1, 2])
    })
  })

  describe('checkIfStringIsInArray', () => {
    it('should check if string contains any array elements', () => {
      expect(checkIfStringIsInArray('hello world', ['hello', 'test'])).toBe(1)
      expect(checkIfStringIsInArray('hello world', ['xyz'])).toBe(0)
    })

    it('should handle empty or undefined input', () => {
      expect(checkIfStringIsInArray('', ['test'])).toBeUndefined()
      expect(checkIfStringIsInArray(undefined, ['test'])).toBeUndefined()
    })
  })

  describe('unstackArrayOfObjects', () => {
    it('should merge array of objects', () => {
      const arr = [
        { a: 1, b: 2 },
        { b: 3, c: 4 },
        { a: 5, d: 6 }
      ]
      expect(unstackArrayOfObjects(arr)).toEqual({
        a: 1,
        b: 2,
        c: 4,
        d: 6
      })
    })

    it('should handle empty array', () => {
      expect(unstackArrayOfObjects([])).toEqual({})
    })

    it('should exclude specified properties', () => {
      const arr = [
        { a: 1, b: 2, excluded: 'no' },
        { b: 3, c: 4, excluded: 'no' }
      ]
      expect(unstackArrayOfObjects(arr, ['excluded'])).toEqual({
        a: 1,
        b: 2,
        c: 4
      })
    })
  })

  describe('removeDuplicatesInArray', () => {
    it('should remove duplicate values from array', () => {
      expect(removeDuplicatesInArray([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4])
      expect(removeDuplicatesInArray(['a', 'b', 'b', 'c'])).toEqual([
        'a',
        'b',
        'c'
      ])
    })

    it('should handle array with no duplicates', () => {
      expect(removeDuplicatesInArray([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('should handle empty array', () => {
      expect(removeDuplicatesInArray([])).toEqual([])
    })

    it('should handle non-array input', () => {
      expect(removeDuplicatesInArray('not an array')).toBe('not an array')
      expect(removeDuplicatesInArray(null)).toBe(null)
    })
  })
})

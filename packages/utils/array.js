'use strict'

import { deepClone, deepMerge } from './object.js'
import { isArray, isNumber, isString } from './types.js'

export const arrayContainsOtherArray = (arr1, arr2) => {
  return arr2.every(val => arr1.includes(val))
}

export const getFrequencyInArray = (arr, value) => {
  return arr.reduce((count, currentValue) => {
    return currentValue === value ? count + 1 : count
  }, 0)
}

export const removeFromArray = (arr, index) => {
  if (isString(index)) index = parseInt(index)
  if (isNumber(index)) {
    if (index < 0 || index >= arr.length || isNaN(index)) {
      throw new Error('Invalid index')
    }
    arr.splice(index, 1)
  } else {
    throw new Error('Invalid index')
  }
  return arr
}

export const swapItemsInArray = (arr, i, j) => {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

export const joinArrays = (...arrays) => {
  return [].concat(...arrays)
}

/**
 * Merges array extendtypes
 */
export const unstackArrayOfObjects = (arr, exclude = []) => {
  return arr.reduce(
    (a, c) => deepMerge(a, deepClone(c, { exclude }), exclude),
    {}
  )
}

export const cutArrayBeforeValue = (arr, value) => {
  const index = arr.indexOf(value)
  if (index !== -1) {
    return arr.slice(0, index)
  }
  return arr
}

export const cutArrayAfterValue = (arr, value) => {
  if (!isArray(arr)) return
  const index = arr.indexOf(value)
  if (index !== -1) {
    return arr.slice(index + 1)
  }
  return arr
}

export const removeValueFromArray = (arr, value) => {
  const index = arr.indexOf(value)
  if (index > -1) {
    const newArray = [...arr]
    newArray.splice(index, 1)
    return newArray
  }
  return arr
}

export const removeValueFromArrayAll = (arr, value) => {
  return arr.filter(item => item !== value)
}

export const addItemAfterEveryElement = (array, item) => {
  // Create a new array to hold the result
  const result = []

  // Loop through the input array
  for (let i = 0; i < array.length; i++) {
    // Add the current element to the result array
    result.push(array[i])

    // If it's not the last element, add the item
    if (i < array.length - 1) {
      result.push(item)
    }
  }

  return result
}

export const reorderArrayByValues = (array, valueToMove, insertBeforeValue) => {
  const newArray = [...array] // Create a copy of the original array
  const indexToMove = newArray.indexOf(valueToMove) // Find the index of the value to move
  const indexToInsertBefore = newArray.indexOf(insertBeforeValue) // Find the index to insert before
  if (indexToMove !== -1 && indexToInsertBefore !== -1) {
    const removedItem = newArray.splice(indexToMove, 1)[0] // Remove the item to move
    const insertIndex =
      indexToInsertBefore < indexToMove
        ? indexToInsertBefore
        : indexToInsertBefore + 1 // Adjust insert index
    newArray.splice(insertIndex, 0, removedItem) // Insert the removed item before the specified value
  }
  return newArray
}

export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}

// Using filter and includes
export const filterArrays = (sourceArr, excludeArr) => {
  return sourceArr.filter(item => !excludeArr.includes(item))
}

// Using Set for better performance with large arrays
export const filterArraysFast = (sourceArr, excludeArr) => {
  const excludeSet = new Set(excludeArr)
  return sourceArr.filter(item => !excludeSet.has(item))
}

export const checkIfStringIsInArray = (string, arr) => {
  if (!string) return
  return arr.filter(v => string.includes(v)).length
}

export const removeDuplicatesInArray = arr => {
  if (!isArray(arr)) return arr
  return [...new Set(arr)]
}

export const addProtoToArray = (state, proto) => {
  for (const key in proto) {
    Object.defineProperty(state, key, {
      value: proto[key],
      enumerable: false, // Set this to true if you want the method to appear in for...in loops
      configurable: true, // Set this to true if you want to allow redefining/removing the property later
      writable: true // Set this to true if you want to allow changing the function later
    })
  }
}

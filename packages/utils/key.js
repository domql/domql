'use strict'

import { exec } from './object.js'

export const generateKey = (function () {
  let index = 0

  function newId () {
    index++
    return index
  }

  return newId
})()

export const createSnapshotId = generateKey

export const createKey = (element, parent, key) => {
  return (exec(key, element) || key || element.key || generateKey()).toString()
}

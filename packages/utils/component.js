'use strict'

import { createExtendsFromKeys } from './extends.js'
import { isString } from './types.js'

export const matchesComponentNaming = key => {
  const isFirstKeyString = isString(key)
  if (!isFirstKeyString) return
  const firstCharKey = key.slice(0, 1)
  return /^[A-Z]*$/.test(firstCharKey)
}

export function getCapitalCaseKeys (obj) {
  return Object.keys(obj).filter(key => /^[A-Z]/.test(key))
}

export function getSpreadChildren (obj) {
  return Object.keys(obj).filter(key => /^\d+$/.test(key))
}

export function isContextComponent (element, parent, passedKey) {
  const { context } = parent || {}
  const [extendsKey] = createExtendsFromKeys(passedKey)
  const key = passedKey || extendsKey
  return context?.components?.[key] || context?.pages?.[key]
}

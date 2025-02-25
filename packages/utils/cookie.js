'use strict'

import { isUndefined } from './types.js'
import { document } from './globals.js'

export const isMobile = (() =>
  typeof navigator === 'undefined' ? false : /Mobi/.test(navigator.userAgent))()

export const setCookie = (cname, cvalue, exdays = 365) => {
  if (isUndefined(document) || isUndefined(document.cookie)) return
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${cname}=${cvalue};${expires};path=/`
}

export const getCookie = cname => {
  if (isUndefined(document) || isUndefined(document.cookie)) return
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
  }
  return ''
}

export const removeCookie = cname => {
  if (isUndefined(document) || isUndefined(document.cookie)) return
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}
/**
 * Load item from the localStorage
 *
 * @param key -- string to identify the storage item
 * @returns {*} -- parsed data or undefined
 */
export function getLocalStorage (key) {
  if (!window.localStorage) {
    return undefined
  }

  const item = window.localStorage.getItem(key)

  if (item === null) {
    return undefined
  }

  try {
    return JSON.parse(item)
  } catch (e) {
    return undefined
  }
}

/**
 * Save the data to window.localStorage
 *
 * @param key  - local storage key to save the data under
 * @param data - the data to save
 */
export function setLocalStorage (key, data) {
  if (!window.localStorage || data === undefined || data === null) {
    return
  }

  const value = typeof data === 'object' ? JSON.stringify(data) : data
  window.localStorage.setItem(key, value)
}

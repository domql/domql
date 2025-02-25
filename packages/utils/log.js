'use strict'

export const logIf = (bool, ...arg) => {
  if (bool) arg.map(v => console.log(v))
}

export const logGroupIf = (bool, key, ...arg) => {
  if (bool) {
    console.group(key)
    arg.map(v => console.log(v))
    console.groupEnd(key)
  }
}

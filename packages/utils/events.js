'use strict'

import { lowercaseFirstLetter } from './string.js'
import { isFunction } from './types.js'

export const addEventFromProps = (key, element) => {
  const { props, on } = element
  const eventName = lowercaseFirstLetter(key.split('on')[1])
  const origEvent = on[eventName]
  const funcFromProps = props[key]
  if (isFunction(origEvent)) {
    on[eventName] = (...args) => {
      const originalEventRetunrs = origEvent(...args)
      if (originalEventRetunrs !== false) funcFromProps(...args)
    }
  } else on[eventName] = funcFromProps
}

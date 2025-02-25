'use strict'

import { isFunction } from './types.js'

export const createIfConditionFlag = (element, parent) => {
  const { __ref: ref } = element

  if (
    isFunction(element.if) &&
    !element.if(element, element.state, element.context)
  ) {
    delete ref.__if
  } else ref.__if = true
}

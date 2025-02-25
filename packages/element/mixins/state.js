'use strict'

import { exec, isObject, STATE_METHODS } from '@domql/utils'

export function state (params, element, node) {
  const state = exec(params, element)

  if (isObject(state)) {
    for (const param in state) {
      if (STATE_METHODS.includes(param)) continue
      if (!Object.hasOwnProperty.call(state, param)) continue
      // element.state[param] = exec(state[param], element)
    }
  }

  return element
}

export default state

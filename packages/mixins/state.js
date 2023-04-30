'use strict'

<<<<<<< HEAD:src/element/mixins/state.js
import { state } from '@domql/mixins/state'
export default state
=======
import { exec, isObject } from '@domql/utils'
import { IGNORE_STATE_PARAMS } from '@domql/state'

export const state = (params, element, node) => {
  const state = exec(params, element)

  if (isObject(state)) {
    for (const param in state) {
      if (IGNORE_STATE_PARAMS.includes(param)) continue
      element.state[param] = exec(state[param], element)
    }
  }

  return element
}
>>>>>>> feature/v2:packages/mixins/state.js

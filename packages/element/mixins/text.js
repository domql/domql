'use strict'

import { create } from '../create.js'
import { exec, isString } from '@domql/utils'

/**
 * Creates a text node and appends into
 * an original one as a child
 */
export function text (param, element, node) {
  let prop = exec(param || element.props.text, element)
  if (isString(prop) && prop.includes('{{')) {
    prop = element.call('replaceLiteralsWithObjectFields', prop)
  }
  if (element.tag === 'string') {
    node.nodeValue = prop
  } else if (param !== undefined || param !== null) {
    if (element.__text) {
      if (element.__text.text === prop) return
      element.__text.text = prop
      if (element.__text.node) element.__text.node.nodeValue = prop
    } else create({ tag: 'string', text: prop }, element, '__text')
  }
}

export default text

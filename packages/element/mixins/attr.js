'use strict'

import { deepMerge, exec, isNot, isNull, isUndefined } from '@domql/utils'
import { report } from '@domql/report'

/**
 * Recursively add attributes to a DOM node
 */
export function attr (params, element, node) {
  const { __ref: ref, props } = element
  const { __attr } = ref
  if (isNot('object')) report('HTMLInvalidAttr', params)
  if (params) {
    const attrs = exec(params, element)
    if (props.attr) deepMerge(attrs, props.attr)
    for (const attr in attrs) {
      const val = exec(attrs[attr], element)
      // if (__attr[attr] === val) return
      if (
        val !== false &&
        !isUndefined(val) &&
        !isNull(val) &&
        node.setAttribute
      ) {
        node.setAttribute(attr, val)
      } else if (node.removeAttribute) node.removeAttribute(attr)
      __attr[attr] = val
    }
  }
}

export default attr

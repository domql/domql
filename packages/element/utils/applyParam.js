'use strict'

import { isFunction } from '@domql/utils'
import { REGISTRY } from '../mixins/index.js'

export const applyParam = (param, element, options) => {
  const { node, context, __ref: ref } = element
  const prop = element[param]

  const { onlyUpdate } = options

  const DOMQLProperty = REGISTRY[param]
  const DOMQLPropertyFromContext =
    context && context.registry && context.registry[param]
  const isGlobalTransformer = DOMQLPropertyFromContext || DOMQLProperty

  const hasDefine = element.define && element.define[param]
  const hasContextDefine = context && context.define && context.define[param]

  if (!ref.__if) return

  const hasOnlyUpdate = onlyUpdate
    ? onlyUpdate === param || element.lookup(onlyUpdate)
    : true

  if (isGlobalTransformer && !hasContextDefine && hasOnlyUpdate) {
    if (isFunction(isGlobalTransformer)) {
      isGlobalTransformer(prop, element, node, options)
      return
    }
  }

  return { hasDefine, hasContextDefine }
}

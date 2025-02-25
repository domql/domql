'use strict'

import { TREE, create as createElement } from '@domql/element'

const create = async (element, parent, key, options) => {
  const domqlElement = await (createElement.default || createElement)(
    element,
    parent,
    key,
    options
  )

  const complete = domqlElement.on?.complete
  if (complete) {
    await domqlElement.on.complete(
      element,
      element.state,
      element.context,
      options
    )
  }
  const onComplete = domqlElement.props?.onComplete
  if (onComplete) {
    await domqlElement.props?.onComplete(
      element,
      element.state,
      element.context,
      options
    )
  }

  const initInspect = domqlElement.on?.initInspect
  if (initInspect) {
    await domqlElement.on.initInspect(
      element,
      element.state,
      element.context,
      options
    )
  }

  const initSync = domqlElement.on?.initSync
  if (initSync) {
    await domqlElement.on.initSync(
      element,
      element.state,
      element.context,
      options
    )
  }

  return domqlElement
}

export default {
  TREE,
  create
}

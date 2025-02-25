'use strict'

import { DOMQ_PROPERTIES, matchesComponentNaming } from '@domql/utils'

export const createValidDomqlObjectFromSugar = (el, parent, key, options) => {
  const newElem = {
    props: {},
    define: {}
  }

  const allowedKeys = ['data', 'state', 'attr', 'if']

  for (const k in el) {
    const value = el[k]
    const isComponent = matchesComponentNaming(k)
    if (isComponent || DOMQ_PROPERTIES.includes(k) || allowedKeys.includes(k)) {
      newElem[k] = value
    } else {
      newElem.props[k] = value
    }
  }
  return newElem
}

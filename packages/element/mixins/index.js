'use strict'

import { attr } from './attr.js'
import { applyClasslist } from './classList.js'
import { setContent } from './content.js'
import { data } from './data.js'
import { html } from './html.js'
import { style } from './style.js'
import { text } from './text.js'
import { state } from './state.js'
import { scope } from './scope.js'
// import { children } from './children.js'

export { applyClasslist as classList }
export { setContent as content }

export {
  attr,
  data,
  style,
  text,
  html,
  // children,
  state,
  scope
}

export * from './registry.js'

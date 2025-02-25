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

export {
  applyClasslist as classList,
  setContent as content,
  attr,
  data,
  style,
  text,
  html,
  state,
  scope
}

export * from './registry.js'

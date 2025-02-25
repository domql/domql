'use strict'

import attr from './attr.js'
import { classList } from './classList.js'
import content from './content.js'
import data from './data.js'
import html from './html.js'
import scope from './scope.js'
import state from './state.js'
import style from './style.js'
import text from './text.js'

export const REGISTRY = {
  attr,
  style,
  text,
  html,
  content,
  data,
  class: classList,
  state,
  scope,
  deps: (param, el) => param || el.parent.deps,

  extends: {},
  children: {},
  childExtends: {},
  childExtendsRecursive: {},
  props: {},
  if: {},
  define: {},
  __name: {},
  __ref: {},
  __hash: {},
  __text: {},
  key: {},
  tag: {},
  query: {},
  parent: {},
  node: {},
  variables: {},
  on: {},
  component: {},
  context: {}
}

export default REGISTRY

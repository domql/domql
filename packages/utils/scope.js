'use strict'

// Create scope - shared object across the elements to the own or the nearest parent
export const createScope = (element, parent) => {
  const { __ref: ref } = element
  // If the element doesn't have a scope, initialize it using the parent's scope or the root's scope.
  if (!element.scope) element.scope = parent.scope || ref.root.scope || {}
}

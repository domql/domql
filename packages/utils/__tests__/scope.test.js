import { createScope } from '../scope'

describe('createScope', () => {
  test('should use parent scope if available', () => {
    const parent = {
      scope: { parentData: true }
    }
    const element = {
      __ref: { root: {} }
    }

    createScope(element, parent)
    expect(element.scope).toBe(parent.scope)
  })

  test('should use root scope if parent scope not available', () => {
    const root = {
      scope: { rootData: true }
    }
    const element = {
      __ref: { root }
    }
    const parent = {}

    createScope(element, parent)
    expect(element.scope).toBe(root.scope)
  })

  test('should create empty scope if no parent or root scope exists', () => {
    const element = {
      __ref: { root: {} }
    }
    const parent = {}

    createScope(element, parent)
    expect(element.scope).toEqual({})
  })
})

import { scope } from '../../mixins/scope'

describe('scope', () => {
  let element, node

  beforeEach(() => {
    element = {
      scope: {}
    }
    node = {}
  })

  it('does nothing if params is not an object', () => {
    scope(null, element, node)
    expect(element.scope).toEqual({})

    scope(123, element, node)
    expect(element.scope).toEqual({})

    scope('invalid', element, node)
    expect(element.scope).toEqual({})
  })

  it('adds non-function values directly to element.scope', () => {
    const params = {
      name: 'John',
      age: 30,
      active: true
    }

    scope(params, element, node)

    expect(element.scope).toEqual({
      name: 'John',
      age: 30,
      active: true
    })
  })

  it('binds functions to the element and adds them to element.scope', () => {
    const params = {
      greet: function () {
        return `Hello, ${this.scope.name}`
      }
    }

    scope(params, element, node)

    expect(typeof element.scope.greet).toBe('function')
    expect(element.scope.greet()).toBe('Hello, undefined') // `this` is bound to `element`

    // Test binding by setting a name
    element.scope.name = 'John'
    expect(element.scope.greet()).toBe('Hello, John')
  })

  it('overwrites existing properties in element.scope', () => {
    element.scope = {
      name: 'Alice',
      age: 25
    }

    const params = {
      name: 'Bob',
      active: true
    }

    scope(params, element, node)

    expect(element.scope).toEqual({
      name: 'Bob',
      age: 25,
      active: true
    })
  })

  it('handles mixed function and non-function values', () => {
    const params = {
      name: 'John',
      greet: function () {
        return `Hello, ${this.scope.name}`
      },
      active: true
    }

    scope(params, element, node)

    expect(element.scope).toEqual({
      name: 'John',
      greet: expect.any(Function),
      active: true
    })

    expect(element.scope.greet()).toBe('Hello, John')
  })

  it('preserves existing properties in element.scope not overwritten by params', () => {
    element.scope = {
      id: 123,
      name: 'Alice'
    }

    const params = {
      name: 'Bob'
    }

    scope(params, element, node)

    expect(element.scope).toEqual({
      id: 123,
      name: 'Bob'
    })
  })

  it('handles empty params object', () => {
    scope({}, element, node)
    expect(element.scope).toEqual({})
  })

  it('ignores non-enumerable properties in params', () => {
    const params = {}
    Object.defineProperty(params, 'hidden', {
      value: 'secret',
      enumerable: false
    })

    scope(params, element, node)

    expect(element.scope.hidden).toBeUndefined()
  })

  it('handles nested objects in params (non-functions)', () => {
    const params = {
      user: {
        name: 'John',
        age: 30
      }
    }

    scope(params, element, node)

    expect(element.scope).toEqual({
      user: {
        name: 'John',
        age: 30
      }
    })
  })

  it('does not modify the node object', () => {
    const params = {
      name: 'John'
    }

    scope(params, element, node)

    expect(node).toEqual({})
  })
})

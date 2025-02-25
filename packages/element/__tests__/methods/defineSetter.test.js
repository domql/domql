import { defineSetter } from '../../methods/v2'

describe('defineSetter', () => {
  let element

  beforeEach(() => {
    element = {}
  })

  it('defines a property with a getter and setter', () => {
    let internalValue = 'initial'
    defineSetter(
      element,
      'key',
      () => internalValue,
      value => {
        internalValue = value
      }
    )

    // Test getter
    expect(element.key).toBe('initial')

    // Test setter
    element.key = 'updated'
    expect(element.key).toBe('updated')
    expect(internalValue).toBe('updated')
  })

  it('allows the getter to compute values dynamically', () => {
    let counter = 0
    defineSetter(
      element,
      'count',
      () => counter,
      value => {
        counter = value
      }
    )

    expect(element.count).toBe(0)

    element.count = 5
    expect(element.count).toBe(5)
  })

  it('throws an error if the getter is not a function', () => {
    expect(() => {
      defineSetter(element, 'key', 'not a function', () => {})
    }).toThrow(TypeError)
  })

  it('throws an error if the setter is not a function', () => {
    expect(() => {
      defineSetter(element, 'key', () => {}, 'not a function')
    }).toThrow(TypeError)
  })

  it('does not allow the property to be deleted by default', () => {
    defineSetter(
      element,
      'key',
      () => 'value',
      () => {}
    )

    expect(() => {
      delete element.key
    }).toThrow(TypeError)
  })

  it('works with nested objects', () => {
    const nested = {}
    defineSetter(
      nested,
      'nestedKey',
      () => 'nestedValue',
      () => {}
    )

    element.nested = nested
    expect(element.nested.nestedKey).toBe('nestedValue')
  })

  it('handles falsy values in getters and setters', () => {
    let internalValue = ''
    defineSetter(
      element,
      'falsy',
      () => internalValue,
      value => {
        internalValue = value
      }
    )

    element.falsy = ''
    expect(element.falsy).toBe('')

    element.falsy = 0
    expect(element.falsy).toBe(0)

    element.falsy = false
    expect(element.falsy).toBe(false)

    element.falsy = null
    expect(element.falsy).toBeNull()

    element.falsy = undefined
    expect(element.falsy).toBeUndefined()
  })

  it('works with symbols as keys', () => {
    const symbolKey = Symbol('unique')
    let internalValue = 'symbolValue'
    defineSetter(
      element,
      symbolKey,
      () => internalValue,
      value => {
        internalValue = value
      }
    )

    expect(element[symbolKey]).toBe('symbolValue')

    element[symbolKey] = 'updatedSymbolValue'
    expect(element[symbolKey]).toBe('updatedSymbolValue')
  })

  it('does not allow redefining the property by default', () => {
    defineSetter(
      element,
      'key',
      () => 'value',
      () => {}
    )

    expect(() => {
      defineSetter(
        element,
        'key',
        () => 'newValue',
        () => {}
      )
    }).toThrow(TypeError)
  })
})

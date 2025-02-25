import { state } from '../../mixins/state'

describe('state', () => {
  let element, node

  beforeEach(() => {
    element = {
      state: {}
    }
    node = {}
  })

  it('returns the element if params is not an object', () => {
    const result = state(null, element, node)
    expect(result).toBe(element)
    expect(element.state).toEqual({})

    const result2 = state(123, element, node)
    expect(result2).toBe(element)
    expect(element.state).toEqual({})

    const result3 = state('invalid', element, node)
    expect(result3).toBe(element)
    expect(element.state).toEqual({})
  })

  it('does not modify element.state if params is not an object', () => {
    state(null, element, node)
    expect(element.state).toEqual({})

    state(123, element, node)
    expect(element.state).toEqual({})

    state('invalid', element, node)
    expect(element.state).toEqual({})
  })

  it('skips non-own properties', () => {
    const params = Object.create({ inherited: 'value' })
    params.own = 'property'

    state(params, element, node)

    expect(params).toEqual({
      own: 'property'
    })
    expect(element.state.inherited).toBeUndefined()
  })

  it('preserves existing properties in element.state not overwritten by params', () => {
    element.state = {
      id: 123,
      name: 'Alice'
    }

    const params = {
      name: 'Bob'
    }

    state(params, element, node)

    expect(element.state).toEqual({
      id: 123,
      name: 'Alice'
    })
  })

  it('handles empty params object', () => {
    state({}, element, node)
    expect(element.state).toEqual({})
  })

  it('does not modify the node object', () => {
    const params = {
      name: 'John'
    }

    state(params, element, node)

    expect(node).toEqual({})
  })
})

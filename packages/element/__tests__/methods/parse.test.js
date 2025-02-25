import { jest } from '@jest/globals'
import { parse } from '../../methods/v2'

describe('parse', () => {
  let element

  // Mock dependencies
  const mockState = {
    parse: jest.fn().mockReturnValue('parsedState')
  }

  beforeEach(() => {
    element = {
      state: mockState,
      props: {
        __element: 'internal',
        update: () => {},
        publicProp: 'publicValue'
      },
      normalKey: 'normalValue',
      undefinedKey: undefined,
      [Symbol('symbolKey')]: 'symbolValue'
    }
    element.__ref = {}
    mockState.parse.mockClear()
  })

  it('returns basic object structure', () => {
    const result = parse.call(element)
    expect(result).toEqual({
      __ref: {},
      props: { publicProp: 'publicValue' },
      normalKey: 'normalValue'
    })
  })

  it('excludes keys in exclusion list', () => {
    const result = parse.call(element, ['state', 'normalKey'])
    expect(result).toEqual({
      __ref: {},
      props: { publicProp: 'publicValue' }
    })
  })

  it('handles state parsing with __hasRootState flag', () => {
    element.__ref.__hasRootState = true
    const result = parse.call(element)
    expect(result.state).toBeUndefined()
  })

  it('uses raw state value when parse method is missing', () => {
    element.state = { data: 'raw' }
    const result = parse.call(element)
    expect(result.state).toBeUndefined()
  })

  it('filters props internal fields', () => {
    const result = parse.call(element)
    expect(result.props).toEqual({
      publicProp: 'publicValue'
    })
  })

  it('skips undefined values', () => {
    const result = parse.call(element)
    expect(result.undefinedKey).toBeUndefined()
  })

  it('handles empty element', () => {
    element = {}
    const result = parse.call(element)
    expect(result).toEqual({})
  })

  it('handles inherited properties', () => {
    const parent = { inheritedKey: 'parentValue' }
    const child = Object.create(parent)
    child.ownKey = 'childValue'

    const result = parse.call(child)
    expect(result).toEqual({
      inheritedKey: 'parentValue',
      ownKey: 'childValue'
    })
  })

  it('handles symbol keys (filtered by keys() implementation)', () => {
    const result = parse.call(element)
    expect(result).not.toHaveProperty('symbolKey')
  })

  it('handles element without __ref', () => {
    delete element.__ref
    const result = parse.call(element)
    expect(result.state).toBeUndefined()
  })
})

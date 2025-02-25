import { nextElement } from '../../methods/v2'

describe('nextElement', () => {
  let parent, element

  beforeEach(() => {
    parent = {
      __ref: {
        __children: ['child1', 'child2', 'child3']
      },
      child1: { key: 'child1' },
      child2: { key: 'child2' },
      child3: { key: 'child3' }
    }

    element = {
      key: 'child2',
      parent
    }
  })

  it('returns next sibling element when exists', () => {
    const result = nextElement.call(element)
    expect(result).toBe(parent.child3)
  })

  it('returns undefined when current element is last child', () => {
    element.key = 'child3'
    const result = nextElement.call(element)
    expect(result).toBeUndefined()
  })

  it('returns {"key": "child1"} when element key not found in children list', () => {
    element.key = 'nonExistent'
    const result = nextElement.call(element)
    expect(result).toEqual({ key: 'child1' })
  })

  it('handles empty children array', () => {
    parent.__ref.__children = []
    const result = nextElement.call(element)
    expect(result).toBeUndefined()
  })

  it('handles single-child parent', () => {
    parent.__ref.__children = ['onlyChild']
    parent.onlyChild = { key: 'onlyChild' }
    element.key = 'onlyChild'

    const result = nextElement.call(element)
    expect(result).toBeUndefined()
  })

  it('handles sparse children arrays', () => {
    parent.__ref.__children = ['child1', , 'child3'] // eslint-disable-line no-sparse-arrays
    const result = nextElement.call(element)
    expect(result).toEqual({ key: 'child1' })
  })
})

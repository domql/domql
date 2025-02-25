import { previousElement } from '../../methods/v2'

describe('previousElement', () => {
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

  it('returns previous sibling when exists', () => {
    const result = previousElement.call(element)
    expect(result).toBe(parent.child1)
  })

  it('returns undefined when element is first child', () => {
    element.key = 'child1'
    const result = previousElement.call(element)
    expect(result).toBeUndefined()
  })

  it('returns undefined when element key not found', () => {
    element.key = 'nonExistent'
    const result = previousElement.call(element)
    expect(result).toBeUndefined()
  })

  it('handles empty __children array', () => {
    parent.__ref.__children = []
    const result = previousElement.call(element)
    expect(result).toBeUndefined()
  })

  it('works with explicit element parameter', () => {
    const altElement = { key: 'child3', parent }
    const result = previousElement(altElement)
    expect(result).toBe(parent.child2)
  })

  it('handles sparse arrays', () => {
    parent.__ref.__children = ['child1', , 'child3'] // eslint-disable-line no-sparse-arrays
    element.key = 'child3'
    const result = previousElement.call(element)
    expect(result).toBeUndefined()
  })

  it('handles null __children', () => {
    parent.__ref.__children = null
    const result = previousElement.call(element)
    expect(result).toBeUndefined()
  })

  it('handles single-child parent', () => {
    parent.__ref.__children = ['onlyChild']
    parent.onlyChild = { key: 'onlyChild' }
    element.key = 'onlyChild'

    const result = previousElement.call(element)
    expect(result).toBeUndefined()
  })
})

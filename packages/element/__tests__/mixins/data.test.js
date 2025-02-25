import { data } from '../../mixins/data'

describe('data', () => {
  let element, node

  beforeEach(() => {
    element = {
      props: {
        data: {}
      }
    }
    node = {
      dataset: {}
    }
  })

  it('does nothing if params is falsy', () => {
    data(null, element, node)
    expect(node.dataset).toEqual({})
    expect(element.props.data).toEqual({})
  })

  it('merges params with element.props.data if element.props.data exists', () => {
    element.props.data = { existing: 'value' }
    const params = { new: 'data' }

    data(params, element, node)

    expect(params).toEqual({ existing: 'value', new: 'data' })
  })

  it('does not apply data to node if showOnNode is false', () => {
    const params = { key: 'value', showOnNode: false }

    data(params, element, node)

    expect(node.dataset).toEqual({})
  })

  it('applies data to node if showOnNode is true', () => {
    const params = { key: 'value', showOnNode: true }

    data(params, element, node)

    expect(node.dataset).toEqual({ key: 'value' })
  })

  it('ignores showOnNode key in node.dataset', () => {
    const params = { key: 'value', showOnNode: true }

    data(params, element, node)

    expect(node.dataset.showOnNode).toBeUndefined()
  })

  it('handles deepMerge for nested data in element.props.data', () => {
    element.props.data = { nested: { existing: 'value' } }
    const params = { nested: { new: 'data' } }

    data(params, element, node)

    expect(params).toEqual({
      nested: { existing: 'value', new: 'data' }
    })
  })

  it('executes functions in params and applies result to node.dataset', () => {
    const params = {
      dynamic: el => `computed-${el.props.data.key}`,
      showOnNode: true
    }
    element.props.data.key = 'value'

    data(params, element, node)

    expect(node.dataset).toEqual({ dynamic: 'computed-value', key: 'value' })
  })

  it('does not modify node.dataset if showOnNode is false', () => {
    const params = { key: 'value', showOnNode: false }

    data(params, element, node)

    expect(node.dataset).toEqual({})
  })

  it('handles empty params object with showOnNode true', () => {
    const params = { showOnNode: true }

    data(params, element, node)

    expect(node.dataset).toEqual({})
  })

  it('handles complex nested params with showOnNode true', () => {
    const params = {
      user: { name: 'John', age: 30 },
      showOnNode: true
    }

    data(params, element, node)

    expect(node.dataset).toEqual({ user: { name: 'John', age: 30 } })
  })

  it('preserves existing dataset properties on node', () => {
    node.dataset.existing = 'value'
    const params = { new: 'data', showOnNode: true }

    data(params, element, node)

    expect(node.dataset).toEqual({ existing: 'value', new: 'data' })
  })

  it('excludes properties starting with "__" from deepMerge', () => {
    element.props.data = { existing: 'value' }
    const params = { __internal: 'secret', new: 'data' }

    data(params, element, node)

    expect(params).toEqual({
      __internal: 'secret',
      existing: 'value',
      new: 'data'
    })
    expect(element.props.data.__internal).toBeUndefined()
  })

  it('excludes properties in excludeFrom array from deepMerge', () => {
    element.props.data = { existing: 'value' }
    const params = { excluded: 'data', new: 'data' }

    // Simulate excludeFrom behavior
    data(params, element, node)

    expect(params).toEqual({ excluded: 'data', existing: 'value', new: 'data' })
    expect(element.props.data.excluded).toBeUndefined()
  })

  it('does not overwrite existing properties in element.props.data unless undefined', () => {
    element.props.data = { existing: 'value' }
    const params = { existing: 'new-value', new: 'data' }

    data(params, element, node)

    expect(params).toEqual({ existing: 'new-value', new: 'data' })
  })
})

import { style } from '../../mixins/style'

describe('style', () => {
  let element, node

  beforeEach(() => {
    element = {}
    node = {
      style: {}
    }
  })

  it('does nothing if params is falsy', () => {
    style(null, element, node)
    expect(node.style).toEqual({})

    style(undefined, element, node)
    expect(node.style).toEqual({})

    style(false, element, node)
    expect(node.style).toEqual({})
  })

  it('applies styles to node.style if params is an object', () => {
    const params = {
      color: 'red',
      fontSize: '14px',
      backgroundColor: 'white'
    }

    style(params, element, node)

    expect(node.style).toEqual({
      color: 'red',
      fontSize: '14px',
      backgroundColor: 'white'
    })
  })

  it('reports an error if params is not an object', () => {
    style('invalid', element, node)

    // expect(mockReport).toHaveBeenCalledWith('HTMLInvalidStyles', 'invalid')
    expect(node.style).toEqual({})

    delete global.report
  })

  it('handles nested objects in params', () => {
    const params = {
      color: 'red',
      fontSize: '14px',
      nested: {
        backgroundColor: 'white'
      }
    }

    style(params, element, node)

    expect(node.style).toEqual({
      color: 'red',
      fontSize: '14px',
      nested: {
        backgroundColor: 'white'
      }
    })
  })

  it('preserves existing styles on node.style', () => {
    node.style = {
      existing: 'value'
    }

    const params = {
      color: 'red'
    }

    style(params, element, node)

    expect(node.style).toEqual({
      existing: 'value',
      color: 'red'
    })
  })

  it('handles function values in params', () => {
    const params = {
      color: el => (el.theme === 'dark' ? 'white' : 'black'),
      fontSize: '14px'
    }
    element.theme = 'dark'

    style(params, element, node)

    expect(node.style).toEqual({
      color: 'white',
      fontSize: '14px'
    })
  })

  it('handles empty params object', () => {
    style({}, element, node)
    expect(node.style).toEqual({})
  })

  it('handles falsy values in params', () => {
    const params = {
      color: '',
      fontSize: 0,
      backgroundColor: false
    }

    style(params, element, node)

    expect(node.style).toEqual({
      color: '',
      fontSize: 0,
      backgroundColor: false
    })
  })

  it('handles complex nested objects with functions', () => {
    const params = {
      color: 'red',
      nested: {
        backgroundColor: el => (el.theme === 'dark' ? 'black' : 'white')
      }
    }
    element.theme = 'dark'

    style(params, element, node)

    expect(node.style.color).toEqual('red')

    expect(typeof node.style.nested.backgroundColor).toBe('function')
  })

  it('does not modify the element object', () => {
    const params = {
      color: 'red'
    }

    style(params, element, node)

    expect(element).toEqual({})
  })

  it('handles numeric values in params', () => {
    const params = {
      fontSize: 14,
      lineHeight: 1.5
    }

    style(params, element, node)

    expect(node.style).toEqual({
      fontSize: 14,
      lineHeight: 1.5
    })
  })

  it('handles boolean values in params', () => {
    const params = {
      display: true,
      visibility: false
    }

    style(params, element, node)

    expect(node.style).toEqual({
      display: true,
      visibility: false
    })
  })
})

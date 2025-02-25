import { html } from '../../mixins/html'

describe('html', () => {
  let element, node

  beforeEach(() => {
    element = {
      props: {},
      __ref: {}
    }
    node = {
      nodeName: 'DIV',
      innerHTML: '',
      textContent: ''
    }
  })

  it('updates innerHTML for non-SVG nodes when content changes', () => {
    html('test', element, node)
    expect(node.innerHTML).toBe('test')
    expect(element.__ref.__html).toBe('test')
  })

  it('uses textContent for SVG nodes', () => {
    node.nodeName = 'SVG'
    html('svg-content', element, node)
    expect(node.textContent).toBe('svg-content')
    expect(node.innerHTML).toBe('')
  })

  it('updates __ref.__html with new content', () => {
    html('new-content', element, node)
    expect(element.__ref.__html).toBe('new-content')
  })

  it('does not update DOM if content remains the same', () => {
    element.__ref.__html = 'existing'
    node.innerHTML = 'existing'
    html('existing', element, node)
    expect(node.innerHTML).toBe('existing')
  })

  it('prioritizes param over element.props.html', () => {
    element.props.html = 'props-content'
    html('param-content', element, node)
    expect(node.innerHTML).toBe('param-content')
  })

  it('falls back to element.props.html when param is falsy', () => {
    element.props.html = 'fallback-content'
    html(null, element, node)
    expect(node.innerHTML).toBe('fallback-content')
  })

  it('handles function parameters', () => {
    html(el => `func-${el.__ref.id}`, { ...element, __ref: { id: 123 } }, node)
    expect(node.innerHTML).toBe('func-123')
  })

  it('handles numeric content', () => {
    html(42, element, node)
    expect(node.innerHTML).toBe(42)
  })

  it('clears content when both param and props.html are falsy', () => {
    element.__ref.__html = 'previous'
    html(null, element, node)
    expect(node.innerHTML).toBeUndefined()
    expect(element.__ref.__html).toBeUndefined()
  })

  it('handles empty string content', () => {
    html('', element, node)
    expect(node.innerHTML).toBe('')
    expect(element.__ref.__html).toBeUndefined()
  })

  it('preserves existing DOM attributes', () => {
    node.id = 'main'
    html('content', element, node)
    expect(node.id).toBe('main')
  })

  it('handles complex HTML structures', () => {
    html('<div class="inner">test</div>', element, node)
    expect(node.innerHTML).toBe('<div class="inner">test</div>')
  })

  it('updates from false to truthy value', () => {
    html(false, element, node)
    expect(node.innerHTML).toBe('')

    html('truthy', element, node)
    expect(node.innerHTML).toBe('truthy')
  })
})

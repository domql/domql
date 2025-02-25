import { jest } from '@jest/globals'
import { removeContent, setContentKey } from '../content'

describe('setContentKey', () => {
  test('should set default content key', () => {
    const element = {
      __ref: {}
    }
    const result = setContentKey(element)
    expect(result).toBe('content')
    expect(element.__ref.contentElementKey).toBe('content')
  })

  test('should set custom content key', () => {
    const element = {
      __ref: {}
    }
    const opts = { contentElementKey: 'customContent' }
    const result = setContentKey(element, opts)
    expect(result).toBe('customContent')
    expect(element.__ref.contentElementKey).toBe('customContent')
    expect(opts.contentElementKey).toBe('content')
  })

  test('should not override existing content key if same value', () => {
    const element = {
      __ref: {
        contentElementKey: 'content'
      }
    }
    const result = setContentKey(element)
    expect(result).toBe('content')
    expect(element.__ref.contentElementKey).toBe('content')
  })

  test('should override existing content key if different value', () => {
    const element = {
      __ref: {
        contentElementKey: 'oldContent'
      }
    }
    const opts = { contentElementKey: 'newContent' }
    const result = setContentKey(element, opts)
    expect(result).toBe('newContent')
    expect(element.__ref.contentElementKey).toBe('newContent')
    expect(opts.contentElementKey).toBe('content')
  })
})

describe('removeContent', () => {
  let element

  beforeEach(() => {
    // Setup basic element structure
    element = {
      node: document.createElement('div'),
      __ref: {}
    }
  })

  test('removes basic content', () => {
    const contentNode = document.createElement('span')
    element.content = {
      node: contentNode,
      tag: 'span'
    }
    element.node.appendChild(contentNode)

    removeContent(element)

    expect(element.content).toBeUndefined()
    expect(element.node.children.length).toBe(0)
  })

  test('removes fragment content', () => {
    element.content = {
      node: element.node,
      tag: 'fragment'
    }
    element.node.innerHTML = '<span>test</span>'

    removeContent(element)

    expect(element.content).toBeUndefined()
    expect(element.node.innerHTML).toBe('')
  })

  test('removes cached content', () => {
    // Test non-fragment cached content
    const mockRemove = jest.fn()
    const contentNode = document.createElement('span')

    // Set up both element content and cached content
    element.content = {
      node: contentNode,
      tag: 'span'
    }
    element.__ref.__cached = {
      content: {
        remove: mockRemove,
        tag: 'span'
      }
    }

    removeContent(element)
    expect(mockRemove).toHaveBeenCalled()

    // Test fragment cached content
    element.content = {
      node: element.node,
      tag: 'fragment'
    }
    element.__ref.__cached = {
      content: {
        tag: 'fragment',
        parent: {
          node: document.createElement('div')
        }
      }
    }
    element.__ref.__cached.content.parent.node.innerHTML = '<span>test</span>'

    removeContent(element)
    expect(element.__ref.__cached.content.parent.node.innerHTML).toBe('')
  })

  test('handles custom content element key', () => {
    const contentNode = document.createElement('span')
    element.customContent = {
      node: contentNode,
      tag: 'span'
    }
    element.node.appendChild(contentNode)

    removeContent(element, { contentElementKey: 'customContent' })

    expect(element.customContent).toBeUndefined()
    expect(element.node.children.length).toBe(0)
  })
})

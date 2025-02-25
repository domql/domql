import { assignNode } from '../append'

describe('assignNode', () => {
  let element
  let parent
  let mockNode
  let mockParentNode

  beforeEach(() => {
    // Setup mock DOM nodes
    mockNode = document.createElement('div')
    mockParentNode = document.createElement('div')

    // Setup mock element and parent objects
    element = {
      key: 'testKey',
      node: mockNode,
      tag: 'div'
    }

    parent = {
      node: mockParentNode
    }
  })

  test('should throw error when element is null', () => {
    expect(() => {
      assignNode(null, parent)
    }).toThrow('Element is required')
  })

  test('should throw error when parent is null', () => {
    expect(() => {
      assignNode(element, null)
    }).toThrow('Element is required')
  })

  test('should assign element to parent using element key', () => {
    const result = assignNode(element, parent)

    // Check key assignment
    expect(parent[element.key]).toBe(element)

    // Check DOM structure
    expect(parent.node.children).toHaveLength(1)
    expect(parent.node.firstChild).toBe(element.node)
    expect(element.node.parentNode).toBe(parent.node)

    // Check return value
    expect(result).toBe(element)
  })

  test('should assign element to parent using custom key', () => {
    const customKey = 'customKey'
    const result = assignNode(element, parent, customKey)

    // Check custom key assignment
    expect(parent[customKey]).toBe(element)
    expect(parent[element.key]).toBeUndefined()

    // Check DOM structure
    expect(parent.node.children).toHaveLength(1)
    expect(parent.node.firstChild).toBe(element.node)
    expect(element.node.parentNode).toBe(parent.node)

    // Check return value
    expect(result).toBe(element)
  })

  test('should not modify DOM when element tag is shadow', () => {
    element.tag = 'shadow'
    const result = assignNode(element, parent)

    // Check key assignment still happens
    expect(parent[element.key]).toBe(element)

    // Check DOM remains unchanged
    expect(parent.node.children).toHaveLength(0)
    expect(element.node.parentNode).toBeNull()

    // Check return value
    expect(result).toBe(element)
  })

  test('should insert node before reference node', () => {
    const referenceNode = document.createElement('div')
    parent.node.appendChild(referenceNode)

    const attachOptions = {
      position: 'before',
      node: referenceNode
    }

    const result = assignNode(element, parent, null, attachOptions)

    // Check key assignment
    expect(parent[element.key]).toBe(element)

    // Check DOM structure
    expect(parent.node.children).toHaveLength(2)
    expect(parent.node.firstChild).toBe(element.node)
    expect(element.node.nextSibling).toBe(referenceNode)
    expect(referenceNode.previousSibling).toBe(element.node)

    // Check return value
    expect(result).toBe(element)
  })

  test('should insert node after reference node', () => {
    const referenceNode = document.createElement('div')
    parent.node.appendChild(referenceNode)

    const attachOptions = {
      position: 'after',
      node: referenceNode
    }

    const result = assignNode(element, parent, null, attachOptions)

    // Check key assignment
    expect(parent[element.key]).toBe(element)

    // Check DOM structure
    expect(parent.node.children).toHaveLength(2)
    expect(parent.node.lastChild).toBe(element.node)
    expect(element.node.previousSibling).toBe(referenceNode)
    expect(referenceNode.nextSibling).toBe(element.node)

    // Check return value
    expect(result).toBe(element)
  })

  test('should use parent node when attachOptions node is not provided', () => {
    const attachOptions = {
      position: 'before'
    }

    const result = assignNode(element, parent, null, attachOptions)

    // Check key assignment
    expect(parent[element.key]).toBe(element)

    // Check DOM structure
    expect(parent.node.children).toHaveLength(0)
    expect(parent.node.firstChild).toBe(null)
    expect(element.node.parentNode).toBe(null)

    // Check return value
    expect(result).toBe(element)
  })
})

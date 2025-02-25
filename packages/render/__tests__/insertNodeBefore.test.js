import { insertNodeBefore } from '../append'

describe('insertNodeBefore', () => {
  let parentNode
  let siblingNode
  let newNode

  beforeEach(() => {
    // Setup fresh DOM elements before each test
    parentNode = document.createElement('div')
    siblingNode = document.createElement('span')
    newNode = document.createElement('p')

    // Add sibling to parent for initial setup
    parentNode.appendChild(siblingNode)
  })

  test('should insert node before sibling with explicit parent', () => {
    insertNodeBefore(newNode, siblingNode, parentNode)

    expect(parentNode.children).toHaveLength(2)
    expect(parentNode.firstChild).toBe(newNode)
    expect(newNode.nextSibling).toBe(siblingNode)
  })

  test('should insert node before sibling using implicit parent', () => {
    // Not passing parent parameter, using sibling's parent
    insertNodeBefore(newNode, siblingNode)

    expect(parentNode.children).toHaveLength(2)
    expect(parentNode.firstChild).toBe(newNode)
    expect(newNode.nextSibling).toBe(siblingNode)
  })

  test('should handle case when parent is null', () => {
    const standaloneNode = document.createElement('div')
    // Passing null as parent
    insertNodeBefore(newNode, standaloneNode, null)

    expect(standaloneNode.previousSibling).toBeNull()
    expect(standaloneNode.parentNode).toBeNull()
  })

  test('should handle case when sibling has no parent', () => {
    const standaloneNode = document.createElement('div')
    insertNodeBefore(newNode, standaloneNode)

    expect(standaloneNode.previousSibling).toBeNull()
    expect(standaloneNode.parentNode).toBeNull()
  })

  test('should throw error when node is null', () => {
    // Arrange
    const errorMessage = 'Node is required'

    // Act & Assert
    expect(() => {
      insertNodeBefore(null, siblingNode, parentNode)
    }).toThrow(errorMessage)

    // Verify the DOM wasn't modified
    expect(parentNode.children).toHaveLength(1)
    expect(parentNode.firstChild).toBe(siblingNode)
  })
})

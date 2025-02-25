import { insertNodeAfter } from '../append'
import { jest } from '@jest/globals'

describe('insertNodeAfter', () => {
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

  test('should throw error when node is null', () => {
    expect(() => {
      insertNodeAfter(null, siblingNode, parentNode)
    }).toThrow('Node is required')

    // Verify DOM wasn't modified
    expect(parentNode.children).toHaveLength(1)
    expect(parentNode.firstChild).toBe(siblingNode)
  })

  test('should insert node after sibling when there is a next sibling', () => {
    // Arrange
    const nextSibling = document.createElement('div')
    parentNode.appendChild(nextSibling)

    // Act
    insertNodeAfter(newNode, siblingNode, parentNode)

    // Assert
    expect(parentNode.children).toHaveLength(3)
    expect(siblingNode.nextSibling).toBe(newNode)
    expect(newNode.nextSibling).toBe(nextSibling)
    expect(newNode.previousSibling).toBe(siblingNode)
  })

  test('should insert node after sibling using insertAdjacentElement', () => {
    // Mock insertAdjacentElement
    const insertAdjacentElementMock = jest.fn()
    siblingNode.insertAdjacentElement = insertAdjacentElementMock

    // Act
    insertNodeAfter(newNode, siblingNode, parentNode)

    // Assert
    expect(insertAdjacentElementMock).toHaveBeenCalledWith('afterend', newNode)
  })

  test('should insert node after sibling when no next sibling exists', () => {
    // Act
    insertNodeAfter(newNode, siblingNode, parentNode)

    // Assert
    expect(parentNode.children).toHaveLength(2)
    expect(siblingNode.nextSibling).toBe(newNode)
    expect(newNode.previousSibling).toBe(siblingNode)
    expect(newNode.nextSibling).toBeNull()
  })

  test('should insert node after sibling using implicit parent', () => {
    // Act
    insertNodeAfter(newNode, siblingNode)

    // Assert
    expect(parentNode.children).toHaveLength(2)
    expect(siblingNode.nextSibling).toBe(newNode)
    expect(newNode.previousSibling).toBe(siblingNode)
  })

  test('should handle null sibling', () => {
    // Act & Assert
    expect(() => {
      insertNodeAfter(newNode, null, parentNode)
    }).not.toThrow()

    // Verify no changes were made to the parent
    expect(parentNode.children).toHaveLength(2)
  })

  test('should handle case when parent and sibling parent are both null', () => {
    const standaloneNode = document.createElement('div')

    // Act & Assert
    expect(() => {
      insertNodeAfter(newNode, standaloneNode, null)
    }).not.toThrow()

    expect(standaloneNode.nextSibling).toBeNull()
    expect(standaloneNode.parentNode).toBeNull()
  })

  test('should handle sibling without insertAdjacentElement', () => {
    // Create a minimal sibling without insertAdjacentElement
    const customSibling = document.createElement('div')
    delete customSibling.insertAdjacentElement

    // Act
    insertNodeAfter(newNode, customSibling, parentNode)

    // Assert
    expect(parentNode.children).toHaveLength(1)
    expect(customSibling.nextSibling).toBe(null)
  })
})

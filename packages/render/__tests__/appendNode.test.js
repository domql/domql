import { jest } from '@jest/globals'
import { appendNode } from '../append'

describe('appendNode', () => {
  let parentNode
  let childNode

  beforeEach(() => {
    // Setup fresh DOM elements before each test
    parentNode = document.createElement('div')
    childNode = document.createElement('span')
  })

  test('should append child to parent node successfully', () => {
    const result = appendNode(childNode, parentNode)

    expect(parentNode.children).toHaveLength(1)
    expect(parentNode.firstChild).toBe(childNode)
    expect(result).toBe(childNode)
  })

  test('should handle invalid parent node', () => {
    const consoleSpy = jest.spyOn(console, 'error')
    const invalidParent = null

    const result = appendNode(childNode, invalidParent)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Does not support to append',
      invalidParent,
      childNode
    )
    expect(result).toBeUndefined()

    consoleSpy.mockRestore()
  })

  test('should handle invalid child node', () => {
    const consoleSpy = jest.spyOn(console, 'error')
    const invalidChild = null

    const result = appendNode(invalidChild, parentNode)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Does not support to append',
      parentNode,
      invalidChild
    )
    expect(result).toBeUndefined()

    consoleSpy.mockRestore()
  })
})

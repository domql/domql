import { jest } from '@jest/globals'
import { initAnimationFrame } from '../animationFrame'

describe('initAnimationFrame', () => {
  let requestAnimationFrameCallback
  let frameListeners
  let mockElement
  let mockOnFrame

  beforeEach(() => {
    // Store callback instead of executing it immediately
    window.requestAnimationFrame = jest.fn(cb => {
      requestAnimationFrameCallback = cb
      return 1 // Return a dummy frame ID
    })

    // Mock console.warn to avoid test output noise
    console.warn = jest.fn()

    // Create mock element with required structure
    mockOnFrame = jest.fn()
    mockElement = {
      node: document.createElement('div'),
      parent: {
        node: document.createElement('div')
      },
      props: {
        onFrame: mockOnFrame
      },
      state: { foo: 'bar' },
      context: { baz: 'qux' }
    }

    // Append child to parent for contains() to work
    mockElement.parent.node.appendChild(mockElement.node)

    // Initialize frameListeners
    frameListeners = initAnimationFrame()
  })

  afterEach(() => {
    // Clean up DOM
    if (mockElement.parent.node.parentNode) {
      mockElement.parent.node.parentNode.removeChild(mockElement.parent.node)
    }
  })

  describe('initialization', () => {
    test('should return an empty Set', () => {
      expect(frameListeners).toBeInstanceOf(Set)
      expect(frameListeners.size).toBe(0)
    })

    test('should request first animation frame', () => {
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
    })
  })

  describe('frame processing', () => {
    test('should call onFrame with correct arguments when element is in DOM', () => {
      // Arrange
      frameListeners.add(mockElement)

      // Act - trigger a single frame
      requestAnimationFrameCallback()

      // Assert
      expect(mockOnFrame).toHaveBeenCalledWith(
        mockElement,
        mockElement.state,
        mockElement.context
      )
    })

    test('should use on.frame if available instead of props.onFrame', () => {
      // Arrange
      const onFrameHandler = jest.fn()
      mockElement.on = { frame: onFrameHandler }
      frameListeners.add(mockElement)

      // Act - trigger a single frame
      requestAnimationFrameCallback()

      // Assert
      expect(onFrameHandler).toHaveBeenCalledWith(
        mockElement,
        mockElement.state,
        mockElement.context
      )
      expect(mockOnFrame).not.toHaveBeenCalled()
    })

    test('should remove element if not in DOM', () => {
      // Arrange
      frameListeners.add(mockElement)
      mockElement.parent.node.removeChild(mockElement.node)

      // Act - trigger a single frame
      requestAnimationFrameCallback()

      // Assert
      expect(frameListeners.has(mockElement)).toBe(false)
      expect(frameListeners.size).toBe(0)
    })

    test('should catch and warn on onFrame errors', () => {
      // Arrange
      const error = new Error('Test error')
      mockElement.props.onFrame = () => {
        throw error
      }
      frameListeners.add(mockElement)

      // Act - trigger a single frame
      requestAnimationFrameCallback()

      // Assert
      expect(console.warn).toHaveBeenCalledWith(error)
      // Element should still be in the set despite the error
      expect(frameListeners.has(mockElement)).toBe(true)
    })

    test('should process multiple elements in the set', () => {
      // Arrange
      const mockElement2 = {
        ...mockElement,
        node: document.createElement('div'),
        props: { onFrame: jest.fn() }
      }
      mockElement.parent.node.appendChild(mockElement2.node)

      frameListeners.add(mockElement)
      frameListeners.add(mockElement2)

      // Act - trigger a single frame
      requestAnimationFrameCallback()

      // Assert
      expect(mockOnFrame).toHaveBeenCalled()
      expect(mockElement2.props.onFrame).toHaveBeenCalled()
      expect(frameListeners.size).toBe(2)
    })
  })

  describe('animation loop', () => {
    test('should request next animation frame after processing', () => {
      // Act - trigger a single frame
      requestAnimationFrameCallback()

      // Assert - should have requested the next frame
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2)
    })
  })
})

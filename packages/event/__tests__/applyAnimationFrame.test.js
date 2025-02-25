import { applyAnimationFrame } from '../animationFrame'

describe('applyAnimationFrame', () => {
  let mockElement
  let mockFrameListeners

  beforeEach(() => {
    // Reset frameListeners
    mockFrameListeners = new Set()

    // Create a mock element with the required structure
    mockElement = {
      props: {},
      on: {},
      __ref: {
        root: {
          data: {
            frameListeners: mockFrameListeners
          }
        }
      }
    }
  })

  describe('error handling', () => {
    test('should throw error when element is null', () => {
      expect(() => {
        applyAnimationFrame(null)
      }).toThrow('Element is invalid')
    })

    test('should throw error when element is undefined', () => {
      expect(() => {
        applyAnimationFrame(undefined)
      }).toThrow('Element is invalid')
    })
  })

  describe('early returns', () => {
    test('should not modify frameListeners when ref.root is undefined', () => {
      // Arrange
      mockElement.__ref.root = undefined

      // Act
      applyAnimationFrame(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(0)
    })

    test('should not modify frameListeners when ref.root.data is undefined', () => {
      // Arrange
      mockElement.__ref.root.data = undefined

      // Act
      applyAnimationFrame(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(0)
    })
  })

  describe('frame listener registration', () => {
    test('should add element to frameListeners when on.frame exists', () => {
      // Arrange
      mockElement.on.frame = () => {}
      expect(mockFrameListeners.size).toBe(0)

      // Act
      applyAnimationFrame(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(1)
      expect(mockFrameListeners.has(mockElement)).toBe(true)
    })

    test('should add element to frameListeners when props.onFrame exists', () => {
      // Arrange
      mockElement.props.onFrame = () => {}
      expect(mockFrameListeners.size).toBe(0)

      // Act
      applyAnimationFrame(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(1)
      expect(mockFrameListeners.has(mockElement)).toBe(true)
    })

    test('should not modify frameListeners when neither on.frame nor props.onFrame exist', () => {
      // Arrange
      expect(mockFrameListeners.size).toBe(0)

      // Act
      applyAnimationFrame(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(0)
      expect(mockFrameListeners.has(mockElement)).toBe(false)
    })

    test('should not modify frameListeners when frameListeners is undefined', () => {
      // Arrange
      mockElement.on.frame = () => {}
      mockElement.__ref.root.data.frameListeners = undefined

      // Act
      applyAnimationFrame(mockElement)

      // Assert - Verify no error is thrown and original state is maintained
      expect(mockElement.__ref.root.data.frameListeners).toBeUndefined()
    })

    test('should add element to frameListeners only once when both on.frame and props.onFrame exist', () => {
      // Arrange
      mockElement.on.frame = () => {}
      mockElement.props.onFrame = () => {}
      expect(mockFrameListeners.size).toBe(0)

      // Act
      applyAnimationFrame(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(1)
      expect(mockFrameListeners.has(mockElement)).toBe(true)
    })
  })
})

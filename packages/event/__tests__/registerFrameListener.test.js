import { registerFrameListener } from '../animationFrame'

describe('registerFrameListener', () => {
  let mockElement
  let mockFrameListeners

  beforeEach(() => {
    // Reset mockFrameListeners before each test
    mockFrameListeners = new Set()

    // Create a mock element with the required structure
    mockElement = {
      __ref: {
        root: {
          data: {
            frameListeners: mockFrameListeners
          }
        }
      }
    }
  })

  describe('successful cases', () => {
    test('should add element to frameListeners when not already present', () => {
      // Arrange
      expect(mockFrameListeners.size).toBe(0)

      // Act
      registerFrameListener(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(1)
      expect(mockFrameListeners.has(mockElement)).toBe(true)
    })

    test('should not add element to frameListeners when already present', () => {
      // Arrange
      mockFrameListeners.add(mockElement)
      expect(mockFrameListeners.size).toBe(1)

      // Act
      registerFrameListener(mockElement)

      // Assert
      expect(mockFrameListeners.size).toBe(1)
      expect(mockFrameListeners.has(mockElement)).toBe(true)
    })

    test('should handle case when frameListeners is undefined', () => {
      // Arrange
      mockElement.__ref.root.data.frameListeners = undefined

      // Act & Assert
      expect(() => {
        registerFrameListener(mockElement)
      }).not.toThrow()
    })
  })

  describe('error cases', () => {
    test('should throw error when element is null', () => {
      expect(() => {
        registerFrameListener(null)
      }).toThrow('Element reference is invalid')
    })

    test('should throw error when element is undefined', () => {
      expect(() => {
        registerFrameListener(undefined)
      }).toThrow('Element reference is invalid')
    })

    test('should throw error when element.__ref is undefined', () => {
      const invalidElement = {}

      expect(() => {
        registerFrameListener(invalidElement)
      }).toThrow('Element reference is invalid')
    })

    test('should throw error when ref.root is undefined', () => {
      mockElement.__ref.root = undefined

      expect(() => {
        registerFrameListener(mockElement)
      }).toThrow('Root reference is invalid')
    })

    test('should throw error when ref.root.data is undefined', () => {
      mockElement.__ref.root.data = undefined

      expect(() => {
        registerFrameListener(mockElement)
      }).toThrow('Data are undefined')
    })
  })
})

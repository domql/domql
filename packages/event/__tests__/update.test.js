import { update } from '../legacy'

describe('update', () => {
  let mockParams
  let mockElement
  let mockState
  let capturedParams

  beforeEach(() => {
    // Reset captured parameters
    capturedParams = {
      element: null,
      state: null
    }

    // Set up test data
    mockParams = { action: 'test', value: 42 }
    mockState = { count: 0 }
    mockElement = {
      id: 'test-element',
      on: {
        update: (element, state) => {
          // Capture parameters for assertion
          capturedParams.element = element
          capturedParams.state = state

          // Modify state to verify the function was called

          if (!state) {
            return
          }

          state.updated = true
          state.count += 1
        }
      }
    }
  })

  test('should return the original params', () => {
    // Act
    const result = update(mockParams, mockElement, mockState)

    // Assert
    expect(result).toBe(mockParams)
  })

  test('should pass correct parameters to the update handler', () => {
    // Act
    update(mockParams, mockElement, mockState)

    // Assert
    expect(capturedParams.element).toBe(mockElement)
    expect(capturedParams.state).toBe(mockState)

    // Verify state was modified by the handler
    expect(mockState.updated).toBe(true)
    expect(mockState.count).toBe(1)
  })

  test('should not modify the params object', () => {
    // Create a copy of params for comparison
    const originalParams = { ...mockParams }

    // Act
    update(mockParams, mockElement, mockState)

    // Assert
    expect(mockParams).toEqual(originalParams)
  })

  test('should not call handler when element has no on property', () => {
    // Arrange
    const elementWithoutOn = {
      id: 'test-element'
    }

    // Act
    const result = update(mockParams, elementWithoutOn, mockState)

    // Assert
    expect(result).toBe(mockParams)
    expect(mockState).not.toHaveProperty('updated')
    expect(mockState.count).toBe(0)
  })

  test('should not call handler when update is missing', () => {
    // Arrange
    const elementWithoutHandler = {
      id: 'test-element',
      on: {
        otherHandler: () => {}
      }
    }

    // Act
    const result = update(mockParams, elementWithoutHandler, mockState)

    // Assert
    expect(result).toBe(mockParams)
    expect(mockState).not.toHaveProperty('updated')
    expect(mockState.count).toBe(0)
  })

  test('should allow handler to make complex state modifications', () => {
    // Arrange
    mockElement.on.update = (element, state) => {
      state.updated = true
      state.updatedBy = element.id
      state.timestamp = 'test-time'
      state.history = state.history || []
      state.history.push('update called')
    }

    // Act
    update(mockParams, mockElement, mockState)

    // Assert
    expect(mockState).toEqual({
      count: 0,
      updated: true,
      updatedBy: 'test-element',
      timestamp: 'test-time',
      history: ['update called']
    })
  })

  test('should work with undefined state', () => {
    // Act
    const result = update(mockParams, mockElement, undefined)

    // Assert
    expect(result).toBe(mockParams)
    expect(capturedParams.state).toBeUndefined()
  })

  test('should work with various param types', () => {
    // Arrange
    const testCases = [
      123,
      'string value',
      true,
      null,
      undefined,
      [1, 2, 3],
      new Date()
    ]

    // Act & Assert
    testCases.forEach(testParam => {
      const result = update(testParam, mockElement, mockState)
      expect(result).toBe(testParam)
    })
  })
})

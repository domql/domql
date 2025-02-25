import { updateState } from '../legacy'

describe('updateState', () => {
  let mockChanges
  let mockElement
  let capturedParams

  beforeEach(() => {
    // Reset captured parameters
    capturedParams = {
      changes: null,
      state: null,
      element: null
    }

    // Set up test data
    mockChanges = { value: 'updated' }
    mockElement = {
      id: 'test-element',
      state: { value: 'original' },
      on: {
        updateState: (changes, state, element) => {
          // Capture parameters for assertion
          capturedParams.changes = changes
          capturedParams.state = state
          capturedParams.element = element

          // Modify state to verify the function was called
          state.wasUpdated = true
        }
      },
      props: { someProp: 'value' }
    }
  })

  test('should pass correct parameters to updateState handler', () => {
    // Act
    updateState(mockChanges, mockElement)

    // Assert
    expect(capturedParams.changes).toEqual({ value: 'updated' })
    expect(capturedParams.state).toEqual({
      value: 'original',
      wasUpdated: true
    })
    expect(capturedParams.element).toBe(mockElement)

    // Verify state was modified by the handler
    expect(mockElement.state.wasUpdated).toBe(true)
  })

  test('should pass the entire element object to the handler', () => {
    // Act
    updateState(mockChanges, mockElement)

    // Assert
    expect(capturedParams.element).toBe(mockElement)
    expect(capturedParams.element).toHaveProperty('on')
    expect(capturedParams.element).toHaveProperty('state')
  })

  test('should not modify the element object structure', () => {
    // Create a copy of the element for comparison
    const originalElement = JSON.parse(JSON.stringify(mockElement))
    originalElement.state.wasUpdated = true // Add the expected state change

    // Act
    updateState(mockChanges, mockElement)

    // Assert - structure should be the same except for the state change
    expect(mockElement).toMatchObject({
      id: originalElement.id,
      props: originalElement.props,
      on: expect.any(Object)
    })
  })

  test('should not call handler when element has no on property', () => {
    // Arrange
    const elementWithoutOn = {
      id: 'test-element',
      state: { value: 'original' },
      props: { someProp: 'value' }
    }

    // Act
    updateState(mockChanges, elementWithoutOn)

    // Assert
    expect(capturedParams.changes).toBeNull()
    expect(capturedParams.state).toBeNull()
    expect(capturedParams.element).toBeNull()
    expect(elementWithoutOn.state).not.toHaveProperty('wasUpdated')
  })

  test('should not call handler when updateState is missing', () => {
    // Arrange
    const elementWithoutHandler = {
      id: 'test-element',
      state: { value: 'original' },
      on: {
        otherHandler: () => {}
      },
      props: { someProp: 'value' }
    }

    // Act
    updateState(mockChanges, elementWithoutHandler)

    // Assert
    expect(capturedParams.changes).toBeNull()
    expect(capturedParams.state).toBeNull()
    expect(capturedParams.element).toBeNull()
    expect(elementWithoutHandler.state).not.toHaveProperty('wasUpdated')
  })

  test('should handle null changes', () => {
    // Act
    updateState(null, mockElement)

    // Assert
    expect(capturedParams.changes).toBeNull()
    expect(capturedParams.state).toEqual({
      value: 'original',
      wasUpdated: true
    })
    expect(mockElement.state.wasUpdated).toBe(true)
  })

  test('should handle undefined changes', () => {
    // Act
    updateState(undefined, mockElement)

    // Assert
    expect(capturedParams.changes).toBeUndefined()
    expect(capturedParams.state).toEqual({
      value: 'original',
      wasUpdated: true
    })
    expect(mockElement.state.wasUpdated).toBe(true)
  })

  test('should handle undefined state in element', () => {
    // Arrange
    let capturedState = null
    const elementWithoutState = {
      id: 'test-element',
      on: {
        updateState: (changes, state, element) => {
          capturedState = state
        }
      },
      props: { someProp: 'value' }
    }

    // Act
    updateState(mockChanges, elementWithoutState)

    // Assert
    expect(capturedState).toBeUndefined()
  })

  test('should allow handler to modify the state object', () => {
    // Arrange
    mockElement.on.updateState = (changes, state, element) => {
      // Make multiple changes to state
      state.value = changes.value
      state.modified = true
      state.timestamp = 'test-time'
    }

    // Act
    updateState(mockChanges, mockElement)

    // Assert
    expect(mockElement.state).toEqual({
      value: 'updated',
      modified: true,
      timestamp: 'test-time'
    })
  })
})

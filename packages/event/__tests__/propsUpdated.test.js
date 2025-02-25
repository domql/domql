import { propsUpdated } from '../legacy'

describe('propsUpdated', () => {
  let mockElement
  let capturedParams

  beforeEach(() => {
    // Reset captured parameters
    capturedParams = {
      props: null,
      state: null,
      element: null
    }

    // Set up test data
    mockElement = {
      id: 'test-element',
      props: { color: 'blue', size: 'large' },
      state: { value: 'original' },
      on: {
        propsUpdated: (props, state, element) => {
          // Capture parameters for assertion
          capturedParams.props = props
          capturedParams.state = state
          capturedParams.element = element

          // Modify state to verify the function was called
          state.propsWereUpdated = true
        }
      }
    }
  })

  test('should pass correct parameters to propsUpdated handler', () => {
    // Act
    propsUpdated(mockElement)

    // Assert
    expect(capturedParams.props).toEqual({ color: 'blue', size: 'large' })
    expect(capturedParams.state).toEqual({
      value: 'original',
      propsWereUpdated: true
    })
    expect(capturedParams.element).toBe(mockElement)

    // Verify state was modified by the handler
    expect(mockElement.state.propsWereUpdated).toBe(true)
  })

  test('should pass the entire element object to the handler', () => {
    // Act
    propsUpdated(mockElement)

    // Assert
    expect(capturedParams.element).toBe(mockElement)
    expect(capturedParams.element).toHaveProperty('on')
    expect(capturedParams.element).toHaveProperty('state')
    expect(capturedParams.element).toHaveProperty('props')
  })

  test('should not modify the element object structure', () => {
    // Create a copy of the element for comparison
    const originalElement = { ...mockElement, state: { ...mockElement.state } }
    originalElement.state.propsWereUpdated = true // Add the expected state change

    // Act
    propsUpdated(mockElement)

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
      props: { color: 'blue', size: 'large' },
      state: { value: 'original' }
    }

    // Act
    propsUpdated(elementWithoutOn)

    // Assert
    expect(capturedParams.props).toBeNull()
    expect(capturedParams.state).toBeNull()
    expect(capturedParams.element).toBeNull()
    expect(elementWithoutOn.state).not.toHaveProperty('propsWereUpdated')
  })

  test('should not call handler when propsUpdated is missing', () => {
    // Arrange
    const elementWithoutHandler = {
      id: 'test-element',
      props: { color: 'blue', size: 'large' },
      state: { value: 'original' },
      on: {
        otherHandler: () => {}
      }
    }

    // Act
    propsUpdated(elementWithoutHandler)

    // Assert
    expect(capturedParams.props).toBeNull()
    expect(capturedParams.state).toBeNull()
    expect(capturedParams.element).toBeNull()
    expect(elementWithoutHandler.state).not.toHaveProperty('propsWereUpdated')
  })

  test('should handle undefined props in element', () => {
    // Arrange
    let capturedProps = null
    const elementWithoutProps = {
      id: 'test-element',
      state: { value: 'original' },
      on: {
        propsUpdated: (props, state, element) => {
          capturedProps = props
          state.propsWereUpdated = true
        }
      }
    }

    // Act
    propsUpdated(elementWithoutProps)

    // Assert
    expect(capturedProps).toBeUndefined()
    expect(elementWithoutProps.state.propsWereUpdated).toBe(true)
  })

  test('should handle undefined state in element', () => {
    // Arrange
    let capturedState = null
    const elementWithoutState = {
      id: 'test-element',
      props: { color: 'blue', size: 'large' },
      on: {
        propsUpdated: (props, state, element) => {
          capturedState = state
        }
      }
    }

    // Act
    propsUpdated(elementWithoutState)

    // Assert
    expect(capturedState).toBeUndefined()
  })

  test('should allow handler to interact with props and state', () => {
    // Arrange
    mockElement.on.propsUpdated = (props, state, element) => {
      // Copy props values to state
      state.savedColor = props.color
      state.savedSize = props.size
      state.timestamp = 'test-time'
    }

    // Act
    propsUpdated(mockElement)

    // Assert
    expect(mockElement.state).toEqual({
      value: 'original',
      savedColor: 'blue',
      savedSize: 'large',
      timestamp: 'test-time'
    })
  })
})

import { updateStateInit } from '../legacy'

describe('updateStateInit', () => {
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
        updateStateInit: (changes, state, element) => {
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

  test('should pass correct parameters to updateStateInit handler', () => {
    // Act
    updateStateInit(mockChanges, mockElement)

    // Assert
    expect(capturedParams.changes).toEqual({ value: 'updated' })
    expect(capturedParams.state).toEqual({
      value: 'original',
      wasUpdated: true
    })
    expect(capturedParams.element).toEqual({
      id: 'test-element',
      props: { someProp: 'value' }
    })

    // Verify state was modified by the handler
    expect(mockElement.state.wasUpdated).toBe(true)
  })

  test('should not include on and state properties in element passed to handler', () => {
    // Act
    updateStateInit(mockChanges, mockElement)

    // Assert
    expect(capturedParams.element).not.toHaveProperty('on')
    expect(capturedParams.element).not.toHaveProperty('state')
  })

  test('should not call handler when element has no on property', () => {
    // Arrange
    const elementWithoutOn = {
      id: 'test-element',
      state: { value: 'original' },
      props: { someProp: 'value' }
    }

    // Act
    updateStateInit(mockChanges, elementWithoutOn)

    // Assert
    expect(capturedParams.changes).toBeNull()
    expect(capturedParams.state).toBeNull()
    expect(capturedParams.element).toBeNull()
    expect(elementWithoutOn.state).not.toHaveProperty('wasUpdated')
  })

  test('should not call handler when updateStateInit is missing', () => {
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
    updateStateInit(mockChanges, elementWithoutHandler)

    // Assert
    expect(capturedParams.changes).toBeNull()
    expect(capturedParams.state).toBeNull()
    expect(capturedParams.element).toBeNull()
    expect(elementWithoutHandler.state).not.toHaveProperty('wasUpdated')
  })

  test('should pass all element properties except on and state to handler', () => {
    // Arrange
    const complexElement = {
      id: 'complex-element',
      state: { value: 'original' },
      on: {
        updateStateInit: (changes, state, element) => {
          capturedParams.element = element
          state.wasUpdated = true
        }
      },
      props: { someProp: 'value' },
      data: { someData: 'data value' },
      methods: {
        someMethod: () => {}
      }
    }

    // Act
    updateStateInit(mockChanges, complexElement)

    // Assert
    expect(capturedParams.element).toEqual({
      id: 'complex-element',
      props: { someProp: 'value' },
      data: { someData: 'data value' },
      methods: {
        someMethod: expect.any(Function)
      }
    })
    expect(complexElement.state.wasUpdated).toBe(true)
  })

  test('should handle null changes', () => {
    // Act
    updateStateInit(null, mockElement)

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
    updateStateInit(undefined, mockElement)

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
        updateStateInit: (changes, state, element) => {
          capturedState = state
        }
      },
      props: { someProp: 'value' }
    }

    // Act
    updateStateInit(mockChanges, elementWithoutState)

    // Assert
    expect(capturedState).toBeUndefined()
  })
})

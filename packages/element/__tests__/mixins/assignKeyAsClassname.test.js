import { assignKeyAsClassname } from '../../mixins/classList' // Adjust the import path as needed

describe('assignKeyAsClassname function', () => {
  test('should set class to key if element.class is true', () => {
    // Setup
    const element = {
      key: 'button',
      class: true
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBe('button')
  })

  test('should set class to key without underscore if key starts with single underscore', () => {
    // Setup
    const element = {
      key: '_container',
      class: undefined
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBe('container')
  })

  test('should not modify class if it already has a string value', () => {
    // Setup
    const element = {
      key: '_card',
      class: 'custom-card'
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBe('custom-card')
  })

  test('should not modify class if key does not start with underscore', () => {
    // Setup
    const element = {
      key: 'header',
      class: undefined
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBeUndefined()
  })

  test('should not modify class if key starts with double underscore', () => {
    // Setup
    const element = {
      key: '__private',
      class: undefined
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBeUndefined()
  })

  test('should not modify class if key is not a string', () => {
    // Setup
    const element = {
      key: 123,
      class: undefined
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBeUndefined()
  })

  test('should handle element with no class property', () => {
    // Setup
    const element = {
      key: '_wrapper'
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBe('wrapper')
  })

  test('should handle element with falsy class value that is not undefined', () => {
    // Setup
    const element = {
      key: '_section',
      class: null
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBe('section')
  })

  test('should handle element with empty string as class', () => {
    // Setup
    const element = {
      key: '_footer',
      class: ''
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBe('footer')
  })

  test('should handle element with no key property', () => {
    // Setup
    const element = {
      class: undefined
    }

    // Execute
    assignKeyAsClassname(element)

    // Assert
    expect(element.class).toBeUndefined()
  })
})

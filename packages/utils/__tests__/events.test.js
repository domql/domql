import { jest } from '@jest/globals'
import { addEventFromProps } from '../events.js'

describe('addEventFromProps', () => {
  test('should add event handler from props to on object', () => {
    const element = {
      on: {},
      props: {
        onClick: () => 'clicked'
      }
    }

    addEventFromProps('onClick', element)

    expect(element.on).toBeDefined()
    expect(typeof element.on.click).toBe('function')
    expect(element.on.click()).toBe('clicked')
  })

  test('should combine existing and new event handlers', () => {
    const handler1Called = jest.fn()
    const handler2Called = jest.fn()

    const element = {
      on: {
        click: handler1Called
      },
      props: {
        onClick: handler2Called
      }
    }

    addEventFromProps('onClick', element)
    element.on.click()

    expect(handler1Called).toHaveBeenCalled()
    expect(handler2Called).toHaveBeenCalled()
  })

  test('should not call new handler if existing returns false', () => {
    const handler2Called = jest.fn()

    const element = {
      on: {
        click: () => false
      },
      props: {
        onClick: handler2Called
      }
    }

    addEventFromProps('onClick', element)
    element.on.click()

    expect(handler2Called).not.toHaveBeenCalled()
  })
})

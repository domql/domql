import { createIfConditionFlag } from '../if.js'

describe('createIfConditionFlag', () => {
  let element
  let parent

  beforeEach(() => {
    element = {
      __ref: {},
      state: {},
      context: {}
    }
    parent = {}
  })

  test('should remove __if when condition returns false', () => {
    element.if = () => false
    createIfConditionFlag(element, parent)
    expect(element.__ref.__if).toBeUndefined()
  })

  test('should set __if to true when condition returns true', () => {
    element.if = () => true
    createIfConditionFlag(element, parent)
    expect(element.__ref.__if).toBe(true)
  })

  test('should set __if to true when if is not a function', () => {
    element.if = undefined
    createIfConditionFlag(element, parent)
    expect(element.__ref.__if).toBe(true)
  })
})

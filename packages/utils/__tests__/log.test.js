import { jest } from '@jest/globals'
import { logIf, logGroupIf } from '../log'

describe('log utilities', () => {
  let consoleLog
  let consoleGroup
  let consoleGroupEnd

  beforeEach(() => {
    consoleLog = jest.spyOn(console, 'log').mockImplementation()
    consoleGroup = jest.spyOn(console, 'group').mockImplementation()
    consoleGroupEnd = jest.spyOn(console, 'groupEnd').mockImplementation()
  })

  afterEach(() => {
    consoleLog.mockRestore()
    consoleGroup.mockRestore()
    consoleGroupEnd.mockRestore()
  })

  describe('logIf', () => {
    it('should log when condition is true', () => {
      logIf(true, 'test message')
      expect(consoleLog).toHaveBeenCalledWith('test message')
    })

    it('should not log when condition is false', () => {
      logIf(false, 'test message')
      expect(consoleLog).not.toHaveBeenCalled()
    })
  })

  describe('logGroupIf', () => {
    it('should create group and log when condition is true', () => {
      logGroupIf(true, 'group name', 'test message')
      expect(consoleGroup).toHaveBeenCalledWith('group name')
      expect(consoleLog).toHaveBeenCalledWith('test message')
      expect(consoleGroupEnd).toHaveBeenCalledWith('group name')
    })

    it('should not create group or log when condition is false', () => {
      logGroupIf(false, 'group name', 'test message')
      expect(consoleGroup).not.toHaveBeenCalled()
      expect(consoleLog).not.toHaveBeenCalled()
      expect(consoleGroupEnd).not.toHaveBeenCalled()
    })
  })
})

import { isProduction, isTest, isDevelopment, getNev } from '../env'

describe('Environment Utils', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('isProduction', () => {
    it('should return true for production environments', () => {
      expect(isProduction('production')).toBe(true)
      expect(isProduction('prod')).toBe(true)
    })

    it('should return true for non-development and non-test environments', () => {
      expect(isProduction('staging')).toBe(true)
      expect(isProduction('qa')).toBe(true)
    })

    it('should return false for development and test environments', () => {
      expect(isProduction('development')).toBe(false)
      expect(isProduction('dev')).toBe(false)
      expect(isProduction('test')).toBe(false)
    })
  })

  describe('isTest', () => {
    it('should return true for test environment', () => {
      expect(isTest('test')).toBe(true)
    })

    it('should return false for non-test environments', () => {
      expect(isTest('development')).toBe(false)
      expect(isTest('production')).toBe(false)
    })
  })

  describe('isDevelopment', () => {
    it('should return true for development environments', () => {
      expect(isDevelopment('development')).toBe(true)
      expect(isDevelopment('dev')).toBe(true)
    })

    it('should return false for non-development environments', () => {
      expect(isDevelopment('production')).toBe(false)
      expect(isDevelopment('test')).toBe(false)
    })
  })

  describe('getNev', () => {
    it('should get environment variable value', () => {
      const mockEnv = {
        API_URL: 'http://api.example.com',
        API_KEY: 'secret-key'
      }

      expect(getNev('API_URL', mockEnv)).toBe('http://api.example.com')
      expect(getNev('API_KEY', mockEnv)).toBe('secret-key')
    })

    it('should return undefined for non-existent keys', () => {
      const mockEnv = { API_URL: 'http://api.example.com' }
      expect(getNev('NON_EXISTENT', mockEnv)).toBeUndefined()
    })
  })
})

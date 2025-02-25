import {
  stringIncludesAny,
  trimStringFromSymbols,
  lowercaseFirstLetter,
  findKeyPosition,
  replaceOctalEscapeSequences,
  encodeNewlines,
  decodeNewlines,
  customEncodeURIComponent,
  customDecodeURIComponent
} from '../string'

describe('String Utils', () => {
  describe('stringIncludesAny', () => {
    it('should return true if string includes any of the characters', () => {
      expect(stringIncludesAny('hello', ['e', 'x'])).toBe(true)
      expect(stringIncludesAny('hello', ['x', 'y'])).toBe(false)
    })
  })

  describe('trimStringFromSymbols', () => {
    it('should remove specified symbols from string', () => {
      expect(trimStringFromSymbols('hello!@world', ['!', '@'])).toBe(
        'helloworld'
      )
      expect(trimStringFromSymbols('test#$test', ['#', '$'])).toBe('testtest')
    })
  })

  describe('lowercaseFirstLetter', () => {
    it('should convert first letter to lowercase', () => {
      expect(lowercaseFirstLetter('Hello')).toBe('hello')
      expect(lowercaseFirstLetter('World')).toBe('world')
    })
  })

  describe('findKeyPosition', () => {
    it('should find key position in object string', () => {
      const str = 'const obj = {\n  name: "John",\n  age: 30\n}'
      const result = findKeyPosition(str, 'name')
      expect(result.startLineNumber).toBe(2)
      expect(result.startColumn).toBe(3)
    })

    it('should handle nested objects', () => {
      const str =
        'const obj = {\n  user: {\n    name: "John",\n    age: 30\n  }\n}'
      const result = findKeyPosition(str, 'user')
      expect(result.startLineNumber).toBe(2)
      expect(result.endLineNumber).toBe(5)
    })

    it('should handle arrays', () => {
      const str = 'const obj = {\n  items: [\n    1,\n    2,\n    3\n  ]\n}'
      const result = findKeyPosition(str, 'items')
      expect(result.startLineNumber).toBe(2)
      expect(result.endLineNumber).toBe(6)
    })

    it('should handle empty objects', () => {
      const str = 'const obj = {\n  empty: {},\n  name: "John"\n}'
      const result = findKeyPosition(str, 'empty')
      expect(result.startLineNumber).toBe(2)
      expect(result.endLineNumber).toBe(2)
    })

    it('should handle single-line objects', () => {
      const str = 'const obj = { name: "John", age: 30 }'
      const result = findKeyPosition(str, 'age')
      expect(result.startLineNumber).toBe(1)
      expect(result.endLineNumber).toBe(1)
    })
  })

  describe('replaceOctalEscapeSequences', () => {
    it('should replace octal sequences with characters', () => {
      expect(replaceOctalEscapeSequences('Hello\\040World')).toBe('Hello World')
      expect(replaceOctalEscapeSequences('\\141\\142\\143')).toBe('abc')
    })
  })

  describe('encodeNewlines and decodeNewlines', () => {
    it('should encode and decode newlines correctly', () => {
      const original = 'Hello\nWorld`$'
      const encoded = encodeNewlines(original)
      const decoded = decodeNewlines(encoded)
      expect(decoded).toBe(original)
    })
  })

  describe('customEncodeURIComponent and customDecodeURIComponent', () => {
    it('should encode and decode special characters', () => {
      const original = 'Hello @World!'
      const encoded = customEncodeURIComponent(original)
      const decoded = customDecodeURIComponent(encoded)
      expect(decoded).toBe(original)
    })
  })
})

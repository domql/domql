import {
  isValidHtmlTag,
  isObject,
  isString,
  isNumber,
  isFunction,
  isBoolean,
  isNull,
  isArray,
  isObjectLike,
  isDefined,
  isUndefined,
  TYPES,
  is,
  isNot
} from '..'

describe('isValidHtmlTag', () => {
  it('returns true for valid HTML tag', () => {
    expect(isValidHtmlTag('div')).toBe(true)
  })

  it('returns false for invalid HTML tag', () => {
    expect(isValidHtmlTag('foo')).toBe(false)
  })
})

describe('isObject', () => {
  it('returns true for object', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('returns false for non-object', () => {
    expect(isObject('foo')).toBe(false)
  })
})

describe('isString', () => {
  it('returns true for string', () => {
    expect(isString('foo')).toBe(true)
  })

  it('returns false for non-string', () => {
    expect(isString(123)).toBe(false)
  })
})

describe('isNumber', () => {
  it('returns true for number', () => {
    expect(isNumber(123)).toBe(true)
  })

  it('returns false for non-number', () => {
    expect(isNumber('foo')).toBe(false)
  })
})

describe('isFunction', () => {
  it('returns true for function', () => {
    expect(isFunction(() => {})).toBe(true)
  })

  it('returns false for non-function', () => {
    expect(isFunction('foo')).toBe(false)
  })
})

describe('isBoolean', () => {
  it('returns true for boolean', () => {
    expect(isBoolean(true)).toBe(true)
  })

  it('returns false for non-boolean', () => {
    expect(isBoolean('foo')).toBe(false)
  })
})

describe('isNull', () => {
  it('returns true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  it('returns false for non-null', () => {
    expect(isNull('foo')).toBe(false)
  })
})

describe('isArray', () => {
  it('returns true for array', () => {
    expect(isArray([])).toBe(true)
  })

  it('returns false for non-array', () => {
    expect(isArray('foo')).toBe(false)
  })
})

describe('isObjectLike', () => {
  it('returns true for object-like value', () => {
    expect(isObjectLike({})).toBe(true)
  })

  it('returns false for null', () => {
    expect(isObjectLike(null)).toBe(false)
  })

  it('returns true for array', () => {
    expect(isObjectLike([])).toBe(true)
  })

  it('returns false for non-object-like value', () => {
    expect(isObjectLike('foo')).toBe(false)
  })
})

describe('isDefined', () => {
  it('returns true for defined value', () => {
    expect(isDefined('foo')).toBe(true)
  })

  it('returns true for null', () => {
    expect(isDefined(null)).toBe(true)
  })

  it('returns false for undefined', () => {
    expect(isDefined(undefined)).toBe(false)
  })
})

describe('isUndefined', () => {
  it('returns true if argument is undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })

  it('returns false if argument is not undefined', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined({})).toBe(false)
    expect(isUndefined([])).toBe(false)
    expect(isUndefined(() => {})).toBe(false)
  })
})

describe('TYPES', () => {
  it('returns true for correct type check functions', () => {
    expect(TYPES.boolean(true)).toBe(true)
    expect(TYPES.boolean(false)).toBe(true)
    expect(TYPES.array([])).toBe(true)
    expect(TYPES.object({})).toBe(true)
    expect(TYPES.string('')).toBe(true)
    expect(TYPES.number(0)).toBe(true)
    expect(TYPES.null(null)).toBe(true)
    expect(TYPES.function(() => {})).toBe(true)
    expect(TYPES.objectLike({})).toBe(true)
  })

  it('returns false for incorrect type check functions', () => {
    expect(TYPES.boolean(null)).toBe(false)
    expect(TYPES.boolean('')).toBe(false)
    expect(TYPES.array({})).toBe(false)
    expect(TYPES.object('')).toBe(false)
    expect(TYPES.string(null)).toBe(false)
    expect(TYPES.number('')).toBe(false)
    expect(TYPES.null('')).toBe(false)
    expect(TYPES.function({})).toBe(false)
    expect(TYPES.objectLike([])).toBe(true)
  })
})

describe('is', () => {
  it('returns true if argument is of any of the provided types', () => {
    const check = is(true)
    expect(check('boolean')).toBe(true)
    expect(check('array')).toBe(false)
    expect(check('object')).toBe(false)
    expect(check('string')).toBe(false)
    expect(check('number')).toBe(false)
    expect(check('null')).toBe(false)
    expect(check('function')).toBe(false)
    expect(check('objectLike')).toBe(false)
    expect(check('node')).toBe(false)
    expect(check('htmlElement')).toBe(false)
    expect(check('defined')).toBe(true)
  })

  it('returns false if argument is not of any of the provided types', () => {
    const check = is(5)
    expect(check('boolean', 'string')).toBe(false)
    expect(check('array', 'object')).toBe(false)
    expect(check('object', 'function')).toBe(false)
    expect(check('string', 'null', 'array')).toBe(false)
    expect(check('number', 'objectLike')).toBe(true)
    expect(check('defined', 'htmlElement')).toBe(true)
  })
})

describe('isNot', () => {
  test('returns true when given type does not match value', () => {
    expect(isNot(true)('number', 'string')).toBe(true)
    expect(isNot([])('object', 'array')).toBe(false)
    expect(isNot('foo')('string', 'number')).toBe(false)
  })

  test('returns false when given type matches value', () => {
    expect(isNot(true)('boolean')).toBe(false)
    expect(isNot([])('array')).toBe(false)
    expect(isNot('foo')('string')).toBe(false)
  })
})

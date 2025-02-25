import {
  createProps,
  createPropsStack,
  inheritParentProps,
  initProps,
  objectizeStringProperty,
  syncProps,
  updateProps,
  removeDuplicateProps,
  applyProps,
  propExists
} from '../props.js'
import { PROPS_METHODS } from '../keys.js'

describe('createProps', () => {
  it('should handle basic props object', () => {
    const element = {
      props: { foo: 'bar', count: 42 },
      __ref: {}
    }
    const result = createProps(element)
    expect(result).toEqual({ foo: 'bar', count: 42 })
    expect(element.__ref.__propsStack).toEqual([])
    expect(element.__ref.__initialProps).toEqual({ foo: 'bar', count: 42 })
  })

  it('should handle non-object props', () => {
    const element = {
      props: 'string value',
      __ref: {}
    }
    const result = createProps(element)
    expect(result).toEqual({})
    expect(element.__ref.__propsStack).toEqual(['string value'])
    expect(element.__ref.__initialProps).toBe('string value')
  })

  it('should handle undefined props', () => {
    const element = {
      __ref: {}
    }
    const result = createProps(element)
    expect(result).toEqual({})
    expect(element.__ref.__propsStack).toEqual([])
    expect(element.__ref.__initialProps).toBeUndefined()
  })
})

describe('objectizeStringProperty', () => {
  it('should convert string to object with inheritedString property', () => {
    expect(objectizeStringProperty('test')).toEqual({ inheritedString: 'test' })
  })

  it('should convert number to object with inheritedString property', () => {
    expect(objectizeStringProperty(42)).toEqual({ inheritedString: 42 })
  })

  it('should return original value for objects', () => {
    const obj = { foo: 'bar' }
    expect(objectizeStringProperty(obj)).toBe(obj)
  })

  it('should return original value for arrays', () => {
    const arr = ['test']
    expect(objectizeStringProperty(arr)).toBe(arr)
  })

  it('should return original value for null', () => {
    expect(objectizeStringProperty(null)).toBe(null)
  })
})

describe('inheritParentProps', () => {
  it('should inherit props from parent based on element key', () => {
    const element = {
      key: 'child1',
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: {
        child1: { foo: 'bar' }
      }
    }
    const result = inheritParentProps(element, parent)
    expect(result).toEqual([{ foo: 'bar' }])
  })

  it('should convert string parent props to object with inheritedString', () => {
    const element = {
      key: 'child1',
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: {
        child1: 'test string'
      }
    }
    const result = inheritParentProps(element, parent)
    expect(result).toEqual([{ inheritedString: 'test string' }])
  })

  it('should inherit childProps from parent', () => {
    const element = {
      key: 'child1',
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: {
        childProps: { shared: 'value' }
      }
    }
    const result = inheritParentProps(element, parent)
    expect(result).toEqual([{ shared: 'value' }])
  })

  it('should not inherit childProps if element has ignoreChildProps', () => {
    const element = {
      key: 'child1',
      props: { ignoreChildProps: true },
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: {
        childProps: { shared: 'value' }
      }
    }
    const result = inheritParentProps(element, parent)
    expect(result).toEqual([])
  })

  it('should combine both key-specific and childProps', () => {
    const element = {
      key: 'child1',
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: {
        child1: { specific: 'value' },
        childProps: { shared: 'value' }
      }
    }
    const result = inheritParentProps(element, parent)
    expect(result).toEqual([{ specific: 'value' }, { shared: 'value' }])
  })
})

describe('syncProps', () => {
  it('should merge props stack correctly', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [{ a: 1 }, { b: 2 }, { a: 3 }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should skip PROPS_METHODS values', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [
      { a: 1 },
      'update', // This is a PROPS_METHOD
      { b: 2 }
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle exec-able props', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [{ a: 1 }, () => ({ b: 2 }), { c: 3 }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle nested function props', () => {
    const element = {
      props: {},
      __ref: {},
      context: { foo: 'bar' }
    }
    const dynamicFn = () => 'dynamic'
    const contextFn = ctx => ctx.foo
    const propsStack = [{ a: dynamicFn }, { b: contextFn }]
    const result = syncProps(propsStack, element)

    expect(result.a).toBe(dynamicFn)
    expect(result.b).toBe(contextFn)
  })

  it('should merge function results with other props', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [
      { static: 'value' },
      () => ({ dynamic: 'value' }),
      { additional: 'prop' }
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      static: 'value',
      dynamic: 'value',
      additional: 'prop'
    })
  })

  it('should handle functions returning functions', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [() => () => ({ nested: 'value' }), { direct: 'prop' }]
    const result = syncProps(propsStack, element)

    expect(result).toEqual({
      nested: 'value',
      direct: 'prop'
    })
  })

  it('should preserve function references when not executed', () => {
    const callback = () => {}
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [{ onClick: callback }, { prop: 'value' }]
    const result = syncProps(propsStack, element)
    expect(result.onClick).toBe(callback)
    expect(result.prop).toBe('value')
  })

  it('should handle array of functions in props', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [
      {
        handlers: [() => ({ a: 1 }), () => ({ b: 2 })]
      }
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      handlers: [expect.any(Function), expect.any(Function)]
    })
    expect(result.handlers[0]()).toEqual({ a: 1 })
    expect(result.handlers[1]()).toEqual({ b: 2 })
  })

  it('should handle functions with element context', () => {
    const element = {
      props: {},
      __ref: {},
      state: { count: 1 }
    }
    const propsStack = [
      element => ({ value: element.state.count }),
      element => ({ double: element.state.count * 2 })
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      value: 1,
      double: 2
    })
  })

  it('should handle nested function props without executing them', () => {
    const element = {
      props: {},
      __ref: {},
      context: { foo: 'bar' }
    }
    const dynamicFn = () => 'dynamic'
    const contextFn = ctx => ctx.foo
    const propsStack = [{ a: dynamicFn }, { b: contextFn }]
    const result = syncProps(propsStack, element)
    // Remove __element and update from comparison
    expect(result).toEqual({
      a: dynamicFn,
      b: contextFn
    })
  })

  it('should merge function results with other props', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const propsStack = [
      { static: 'value' },
      () => ({ dynamic: 'value' }),
      { additional: 'prop' }
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      static: 'value',
      dynamic: 'value',
      additional: 'prop'
    })
  })

  it('should handle functions returning functions', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const nestedFn = () => () => ({ nested: 'value' })
    const propsStack = [nestedFn, { direct: 'prop' }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      direct: 'prop',
      nested: 'value'
    })
  })

  it('should handle functions with element context without executing them', () => {
    const element = {
      props: {},
      __ref: {},
      state: { count: 1 }
    }
    const valueFn = element => element.state.count
    const doubleFn = element => element.state.count * 2
    const propsStack = [
      {
        value: valueFn,
        double: doubleFn
      }
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      value: valueFn,
      double: doubleFn
    })
  })

  it('should handle function props by preserving them', () => {
    const element = {
      props: {},
      __ref: {},
      context: { foo: 'bar' }
    }
    const dynamicFn = () => 'dynamic'
    const contextFn = ctx => ctx.foo
    const propsStack = [{ a: dynamicFn }, { b: contextFn }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      a: dynamicFn,
      b: contextFn
    })
  })

  it('should merge props while preserving functions', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const dynamicFn = () => ({ dynamic: 'value' })
    const propsStack = [{ static: 'value' }, dynamicFn, { additional: 'prop' }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      static: 'value',
      additional: 'prop',
      dynamic: 'value'
    })
  })

  it('should preserve nested functions', () => {
    const element = {
      props: {},
      __ref: {}
    }
    const nestedFn = () => () => ({ nested: 'value' })
    const propsStack = [nestedFn, { direct: 'prop' }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      nested: 'value',
      direct: 'prop'
    })
  })

  it('should preserve element context functions', () => {
    const element = {
      props: {},
      __ref: {},
      state: { count: 1 }
    }
    const valueFn = element => element.state.count
    const doubleFn = element => element.state.count * 2
    const propsStack = [
      {
        value: valueFn,
        double: doubleFn
      }
    ]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      value: valueFn,
      double: doubleFn
    })
  })

  it('should preserve named function references', () => {
    const element = {
      props: {},
      __ref: {}
    }
    function namedFunction () {
      return true
    }
    const propsStack = [{ handler: namedFunction }]
    const result = syncProps(propsStack, element)
    expect(result).toEqual({
      handler: namedFunction
    })
  })
})

describe('createPropsStack', () => {
  it('should create basic props stack', () => {
    const element = {
      props: { foo: 'bar' },
      __ref: { __propsStack: [] }
    }
    const parent = { props: {} }
    const result = createPropsStack(element, parent)
    expect(result).toEqual([{ foo: 'bar' }])
  })

  it('should handle string "inherit" prop', () => {
    const element = {
      props: 'inherit',
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: { parentProp: 'value' }
    }
    const result = createPropsStack(element, parent)
    expect(result).toEqual([{ parentProp: 'value' }])
  })

  it('should handle extends stack', () => {
    const element = {
      props: { local: 'value' },
      __ref: {
        __propsStack: [],
        __extendsStack: [
          { props: { extended1: 'value1' } },
          { props: { extended2: 'value2' } }
        ]
      }
    }
    const parent = { props: {} }
    const result = createPropsStack(element, parent)
    expect(result).toEqual([
      { local: 'value' },
      { extended1: 'value1' },
      { extended2: 'value2' }
    ])
  })

  it('should inherit parent props correctly', () => {
    const element = {
      key: 'child',
      props: { local: 'value' },
      __ref: {
        __propsStack: []
      }
    }
    const parent = {
      props: {
        child: { specific: 'value' },
        childProps: { shared: 'common' }
      }
    }
    const result = createPropsStack(element, parent)
    expect(result).toEqual([
      { specific: 'value' },
      { shared: 'common' },
      { local: 'value' }
    ])
  })

  it('should skip duplicate props from extends', () => {
    const props = { local: 'value' }
    const element = {
      props,
      __ref: {
        __propsStack: [],
        __extendsStack: [{ props }, { props: { other: 'value' } }]
      }
    }
    const parent = { props: {} }
    const result = createPropsStack(element, parent)
    expect(result).toEqual([{ local: 'value' }, { other: 'value' }])
  })
})

describe('initProps', () => {
  it('should initialize basic props', () => {
    const element = {
      props: { foo: 'bar' },
      __ref: {}
    }
    const parent = {}
    const result = initProps(element, parent)
    expect(result.props).toEqual({ foo: 'bar' })
    expect(result.props.__element).toBe(element)
    expect(typeof result.props.update).toBe('function')
  })

  it('should handle conditional initialization with __if', () => {
    const element = {
      props: { foo: 'bar' },
      __ref: { __if: true }
    }
    const parent = {}
    const result = initProps(element, parent)
    expect(result.props).toEqual({ foo: 'bar' })
  })

  it('should handle failed initialization gracefully', () => {
    const element = {
      props: null,
      __ref: {}
    }
    const parent = {}
    const result = initProps(element, parent)
    expect(result.props).toEqual({})
    expect(result.__ref.__propsStack).toEqual([])
  })

  it('should inherit and merge parent props correctly', () => {
    const element = {
      key: 'child',
      props: { local: 'value' },
      __ref: {}
    }
    const parent = {
      props: {
        child: { parent: 'value' },
        childProps: { shared: 'value' }
      }
    }
    const result = initProps(element, parent)

    // Extract props for comparison, excluding special properties
    const { __element, update, ...props } = result.props

    // Test regular props
    expect(props).toEqual({
      local: 'value',
      shared: 'value'
    })

    // Test special properties separately
    expect(__element).toBe(element)
    expect(typeof update).toBe('function')
  })

  it('should handle empty props', () => {
    const element = {
      __ref: {}
    }
    const parent = {}
    const result = initProps(element, parent)
    expect(result.props).toEqual({})
    expect(result.__ref.__propsStack).toEqual([])
  })
})

describe('updateProps', () => {
  it('should update props with new values', () => {
    const element = {
      props: { initial: 'value' },
      __ref: { __propsStack: [{ initial: 'value' }] }
    }
    const newProps = { updated: 'value' }
    const result = updateProps(newProps, element, {})

    // Remove __element and update before comparison
    const { __element, update, ...props } = result.props
    expect(props).toEqual({
      initial: 'value',
      updated: 'value'
    })
    expect(__element).toBe(element)
    expect(typeof update).toBe('function')
  })

  it('should merge with inherited parent props', () => {
    const element = {
      key: 'child',
      props: { local: 'value' },
      __ref: { __propsStack: [{ local: 'value' }] }
    }
    const parent = {
      props: {
        child: { parent: 'value' },
        childProps: { shared: 'value' }
      }
    }
    const newProps = { updated: 'value' }
    const result = updateProps(newProps, element, parent)

    const { __element, update, ...props } = result.props
    expect(props).toEqual({
      local: 'value',
      shared: 'value',
      updated: 'value'
    })
  })

  it('should preserve function props', () => {
    const handler = () => {}
    const element = {
      props: { onClick: handler },
      __ref: { __propsStack: [{ onClick: handler }] }
    }
    const newProps = { updated: 'value' }
    const result = updateProps(newProps, element, {})

    const { __element, update, ...props } = result.props
    expect(props.onClick).toBe(handler)
    expect(props.updated).toBe('value')
  })

  it('should handle empty updates', () => {
    const element = {
      props: { existing: 'value' },
      __ref: { __propsStack: [{ existing: 'value' }] }
    }
    const result = updateProps(null, element, {})

    const { __element, update, ...props } = result.props
    expect(props).toEqual({ existing: 'value' })
  })

  it('should maintain props stack order', () => {
    const element = {
      key: 'child',
      props: { local: 'original' },
      __ref: { __propsStack: [{ local: 'original' }] }
    }
    const parent = {
      props: { child: { parent: 'value' } }
    }
    const newProps = { local: 'updated' }
    const result = updateProps(newProps, element, parent)

    expect(result.__ref.__propsStack).toEqual([
      { local: 'updated' },
      { parent: 'value' },
      { local: 'original' }
    ])
  })
})

describe('removeDuplicateProps', () => {
  test('removes duplicate primitive values', () => {
    const input = ['a', 'b', 'a', 'c', 'b']
    expect(removeDuplicateProps(input)).toEqual(['a', 'b', 'c'])
  })

  test('handles null and undefined values', () => {
    const input = [null, undefined, 'a', null, 'b', undefined]
    expect(removeDuplicateProps(input)).toEqual(['a', 'b'])
  })

  test('removes duplicate objects by value', () => {
    const input = [{ foo: 1 }, { foo: 1 }, { bar: 2 }]
    expect(removeDuplicateProps(input)).toEqual([{ foo: 1 }, { bar: 2 }])
  })

  test('skips PROPS_METHODS', () => {
    const input = ['method1', { prop: 1 }, 'method2']
    const methods = ['method1', 'method2']
    PROPS_METHODS.push(...methods)
    expect(removeDuplicateProps(input)).toEqual([{ prop: 1 }])
    // Cleanup
    methods.forEach(m => {
      const index = PROPS_METHODS.indexOf(m)
      if (index > -1) PROPS_METHODS.splice(index, 1)
    })
  })

  test('maintains order of first occurrence', () => {
    const input = [{ first: 1 }, { second: 2 }, { first: 1 }, { third: 3 }]
    expect(removeDuplicateProps(input)).toEqual([
      { first: 1 },
      { second: 2 },
      { third: 3 }
    ])
  })

  test('handles mixed type props', () => {
    const input = ['string', 42, { obj: true }, 'string', { obj: true }, 42]
    expect(removeDuplicateProps(input)).toEqual(['string', 42, { obj: true }])
  })
})

describe('propExists', () => {
  test('should handle primitive values', () => {
    const stack = ['a', 'b', 'c']
    expect(propExists('a', stack)).toBe(true)
    expect(propExists('d', stack)).toBe(false)
  })

  test('should handle null and undefined', () => {
    const stack = [null, 'a', undefined]
    expect(propExists(null, stack)).toBe(false)
    expect(propExists(undefined, stack)).toBe(false)
  })

  test('should handle empty stack', () => {
    expect(propExists({ foo: 'bar' }, [])).toBe(false)
  })

  test('should compare objects by value', () => {
    const stack = [{ foo: 1 }, { bar: 2 }]
    expect(propExists({ foo: 1 }, stack)).toBe(true)
    expect(propExists({ baz: 3 }, stack)).toBe(false)
  })

  test('should handle identical object references', () => {
    const obj = { foo: 'bar' }
    const stack = [obj]
    expect(propExists(obj, stack)).toBe(true)
  })
})

describe('applyProps', () => {
  test('should not reset props with new propsStack', () => {
    const element = {
      props: { old: 'value' },
      __ref: { __propsStack: [{ old: 'value' }] }
    }
    const parent = {
      props: { childProps: { new: 'value' } }
    }

    applyProps(element, parent)
    expect(element.__ref.__propsStack).toEqual([
      { new: 'value' },
      { old: 'value' }
    ])

    // Extract regular props for comparison
    const { __element, update, ...props } = element.props
    expect(props).toEqual({ new: 'value', old: 'value' })

    // Verify special properties
    expect(__element).toBe(element)
    expect(typeof update).toBe('function')
  })

  test('should handle empty props case', () => {
    const element = {
      props: {},
      __ref: { __propsStack: [] }
    }
    const parent = {}

    applyProps(element, parent)
    expect(element.__ref.__propsStack).toEqual([{}])
    expect(element.props).toEqual({})
  })

  test('should inherit parent props correctly', () => {
    const element = {
      key: 'child',
      props: { local: 'value' },
      __ref: { __propsStack: [] }
    }
    const parent = {
      props: {
        child: { specific: 'value' },
        childProps: { shared: 'value' }
      }
    }

    applyProps(element, parent)
    expect(element.__ref.__propsStack).toEqual([
      { specific: 'value' },
      { shared: 'value' },
      { local: 'value' }
    ])
  })

  test('should handle extends stack', () => {
    const element = {
      props: { base: 'value' },
      __ref: {
        __propsStack: [],
        __extendsStack: [{ props: { extended: 'value' } }]
      }
    }
    const parent = {}

    applyProps(element, parent)
    expect(element.__ref.__propsStack).toEqual([
      { base: 'value' },
      { extended: 'value' }
    ])
  })
})

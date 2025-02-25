import { jest } from '@jest/globals'
import {
  createExtends,
  generateHash,
  getHashedExtend,
  setHashedExtend,
  getExtendsStackRegistry,
  extractArrayExtend,
  deepExtend,
  flattenExtend,
  deepMergeExtends,
  cloneAndMergeArrayExtend,
  mapStringsWithContextComponents,
  jointStacks,
  getExtendsStack,
  getExtendsInElement,
  createExtendsFromKeys,
  addExtends,
  createElementExtends,
  inheritChildExtends,
  inheritRecursiveChildExtends,
  createExtendsStack,
  finalizeExtends,
  applyExtends
} from '../extends.js'

describe('createExtends', () => {
  test('creates extends from key and element extends', () => {
    const element = { extends: 'BaseComponent' }
    const parent = {}
    const key = 'Button+Input'

    const result = createExtends(element, parent, key)
    expect(result).toEqual(['Button', 'Input', 'BaseComponent'])
  })

  test('handles element with array extends', () => {
    const element = { extends: ['Base', 'Mixin'] }
    const parent = {}
    const key = 'Component'

    const result = createExtends(element, parent, key)
    expect(result).toEqual(['Component', 'Base', 'Mixin'])
  })

  test('handles element without extends', () => {
    const element = {}
    const parent = {}
    const key = 'Simple'

    const result = createExtends(element, parent, key)
    expect(result).toEqual(['Simple'])
  })

  test('handles underscore notation in key', () => {
    const element = {}
    const parent = {}
    const key = 'Button_primary'

    const result = createExtends(element, parent, key)
    expect(result).toEqual(['Button'])
  })

  test('handles dot notation in key', () => {
    const element = {}
    const parent = {}
    const key = 'Button.label'

    const result = createExtends(element, parent, key)
    expect(result).toEqual(['Button'])
  })
})

describe('Hash functions', () => {
  test('generateHash returns string', () => {
    expect(typeof generateHash()).toBe('string')
    expect(generateHash()).not.toBe(generateHash())
  })

  test('setHashedExtend and getHashedExtend', () => {
    const extend = {}
    const stack = ['item1', 'item2']
    setHashedExtend(extend, stack)
    expect(extend.__hash).toBeDefined()
    expect(getHashedExtend(extend)).toEqual(stack)
  })

  test('getExtendsStackRegistry with hashed extend', () => {
    const extend = {}
    const initialStack = ['item1']
    const hashedStack = ['item2', 'item3']

    // Setup a hashed extend
    setHashedExtend(extend, hashedStack)

    // Test getting the registry with hashed extend
    const result = getExtendsStackRegistry(extend, initialStack)
    expect(result).toEqual(initialStack.concat(hashedStack))
  })

  test('getExtendsStackRegistry with non-hashed extend', () => {
    const extend = { prop: 'value' }
    const stack = ['item1', 'item2']

    // Test getting the registry with non-hashed extend
    const result = getExtendsStackRegistry(extend, stack)
    expect(result).toBe(stack)
    expect(extend.__hash).toBeDefined()
  })
})

describe('createExtendsFromKeys', () => {
  test('extracts component key with + separator', () => {
    expect(createExtendsFromKeys('Button+Input')).toEqual(['Button', 'Input'])
  })

  test('extracts component key with _ separator', () => {
    expect(createExtendsFromKeys('Button_primary')).toEqual(['Button'])
  })

  test('extracts component key with . separator', () => {
    expect(createExtendsFromKeys('Button.label')).toEqual(['Button'])
    expect(createExtendsFromKeys('Button.Label')).toEqual(['Button.Label'])
  })

  test('returns original key if no separator', () => {
    expect(createExtendsFromKeys('Button')).toEqual(['Button'])
  })
})

describe('Extend stacking', () => {
  test('extractArrayExtend handles array of extends', () => {
    const extend = [{ prop: 1 }, { prop: 2 }]
    const stack = []
    extractArrayExtend(extend, stack)
    expect(stack).toEqual(extend)
  })

  test('deepExtend processes nested extends', () => {
    const extend = { extends: { prop: 'value' } }
    const stack = []
    deepExtend(extend, stack)
    expect(stack).toEqual([{ prop: 'value' }])
  })

  test('flattenExtend handles various input types', () => {
    const stack = []
    expect(flattenExtend(null, stack)).toEqual(stack)
    expect(flattenExtend([{ prop: 1 }], stack)).toEqual([{ prop: 1 }])
    expect(flattenExtend({ prop: 'value' }, [])).toEqual([{ prop: 'value' }])
  })
})

describe('Merge operations', () => {
  test('deepMergeExtends merges objects correctly', () => {
    const element = { a: 1, b: { c: 2 } }
    const extend = { b: { d: 3 }, e: 4 }
    const result = deepMergeExtends(element, extend)
    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
  })

  test('cloneAndMergeArrayExtend merges array of objects', () => {
    const stack = [{ a: 1 }, { b: 2 }]
    const result = cloneAndMergeArrayExtend(stack)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  test('deepMergeExtends handles array to object merge', () => {
    const element = { items: [{ id: 1 }, { id: 2 }] }
    const extend = { items: { length: 2, type: 'list' } }
    const result = deepMergeExtends(element, extend)
    expect(result.items).toEqual({
      0: { id: 1 },
      1: { id: 2 },
      length: 2,
      type: 'list'
    })
  })

  test('deepMergeExtends assigns function when property is undefined', () => {
    const element = { existingProp: 'value' }
    const extend = {
      handler: () => 'handled',
      existingProp: () => 'ignored'
    }
    const result = deepMergeExtends(element, extend)
    expect(typeof result.handler).toBe('function')
    expect(result.handler()).toBe('handled')
    expect(result.existingProp).toBe('value') // Should not override existing prop
  })
})

describe('String extend handling', () => {
  test('mapStringsWithContextComponents handles component strings', () => {
    const context = {
      components: {
        test: { prop: 'value' }
      }
    }
    expect(mapStringsWithContextComponents('test', context)).toEqual({
      prop: 'value'
    })
    expect(
      mapStringsWithContextComponents('nonexistent', context)
    ).toBeUndefined()
  })
})

describe('Stack operations', () => {
  test('jointStacks combines stacks correctly', () => {
    const stack1 = [1, 2, 3]
    const stack2 = [4, 5, 6]
    expect(jointStacks(stack1, stack2)).toEqual([1, 4, 2, 3, 5, 6])
  })

  test('getExtendsStack processes extends correctly', () => {
    const extend = { prop: 'value' }
    expect(getExtendsStack(extend)).toEqual([extend])
  })
})

describe('Additional extend operations', () => {
  test('getExtendsInElement finds all extends', () => {
    const obj = {
      Component: true,
      extends: 'BaseComponent',
      nested: {
        OtherComponent: true,
        extends: ['Component1', 'Component2']
      }
    }
    const result = getExtendsInElement(obj)
    expect(result).toContain('Component')
    expect(result).toContain('BaseComponent')
    expect(result).toContain('OtherComponent')
    expect(result).toContain('Component1')
    expect(result).toContain('Component2')
  })
})

describe('Complex extend scenarios', () => {
  test('handles deeply nested extends', () => {
    const extend = {
      extends: {
        extends: {
          extends: { prop: 'deepValue' }
        }
      }
    }
    const stack = []
    deepExtend(extend, stack)
    expect(stack).toEqual([
      {
        prop: 'deepValue'
      }
    ])
  })

  test('handles multiple levels of array extends', () => {
    const extend = [
      { a: 1 },
      [{ b: 2 }, { c: 3 }],
      { extends: [{ d: 4 }, { e: 5 }] }
    ]
    const stack = []
    flattenExtend(extend, stack)

    // Should flatten all nested arrays and extends without duplicating objects
    expect(stack).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }])
  })

  test('merges complex nested structures', () => {
    const element = {
      a: 1,
      b: { c: 2, d: { e: 3 } },
      f: [1, 2, { g: 3 }]
    }
    const extend = {
      b: { d: { h: 4 }, i: 5 },
      f: [4, { j: 5 }],
      k: 6
    }
    const result = deepMergeExtends(element, extend)
    expect(result).toEqual({
      a: 1,
      b: { c: 2, d: { e: 3, h: 4 }, i: 5 },
      f: [1, 2, { g: 3 }, 4, { j: 5 }],
      k: 6
    })
  })

  test('handles mixed string and object extends in context', () => {
    const context = {
      components: {
        Base: { base: true },
        'Base.variant': { variant: true },
        'smbls.Button': { button: true }
      }
    }
    const extends1 = ['Base', { custom: true }]
    const extends2 = ['Base.variant', 'smbls.Button']

    const stack1 = []
    const stack2 = []
    flattenExtend(extends1, stack1, context)
    flattenExtend(extends2, stack2, context)

    expect(stack1).toEqual([{ base: true }, { custom: true }])
    expect(stack2).toEqual([{ variant: true }, { button: true }])
  })

  test('correctly processes complex getExtendsStack scenarios', () => {
    const baseExtend = {
      extends: [{ common: true }, { extends: { nested: true } }]
    }
    const childExtend = {
      extends: baseExtend
    }

    const stack = getExtendsStack(childExtend)
    expect(stack).toContainEqual({ common: true })
    expect(stack).toContainEqual({ nested: true })
  })

  test('handles circular references in extends', () => {
    const extendA = { name: 'A', value: 1 }
    const extendB = { name: 'B', value: 2 }
    const extendC = { name: 'C', value: 3 }

    // Create circular reference chain: A -> B -> C -> A
    extendA.extends = extendB
    extendB.extends = extendC
    extendC.extends = extendA

    const stack = []
    flattenExtend(extendA, stack)

    // Should process each extend exactly once
    expect(stack).toHaveLength(3)
    expect(stack).toEqual([
      { name: 'C', value: 3 },
      { name: 'B', value: 2 },
      { name: 'A', value: 1 }
    ])
  })

  test('complex component inheritance chain', () => {
    const context = {
      components: {
        BaseComponent: { base: true, method: () => {} },
        ExtendedComponent: {
          extends: 'BaseComponent',
          extended: true
        },
        FinalComponent: {
          extends: ['ExtendedComponent', { custom: true }],
          final: true
        }
      }
    }

    const result = getExtendsStack('FinalComponent', context)
    expect(result).toEqual([
      { base: true, method: expect.any(Function) },
      { extended: true },
      { custom: true },
      { final: true }
    ])
  })
})

describe('addExtends', () => {
  test('adds single extend to element', () => {
    const element = {
      __ref: {
        __extends: ['BaseComponent']
      }
    }
    const newExtend = 'Button'
    const result = addExtends(newExtend, element)
    expect(result).toEqual(['BaseComponent', 'Button'])
  })

  test('adds array of extends to element', () => {
    const element = {
      __ref: {
        __extends: ['BaseComponent']
      }
    }
    const newExtends = ['Button', 'Input']
    const result = addExtends(newExtends, element)
    expect(result).toEqual(['BaseComponent', 'Button', 'Input'])
  })

  test('handles empty newExtends', () => {
    const element = {
      __ref: {
        __extends: ['BaseComponent']
      }
    }
    const result = addExtends(null, element)
    expect(result).toEqual(['BaseComponent'])
  })

  test('updates element __ref.__extends', () => {
    const element = {
      __ref: {
        __extends: ['BaseComponent']
      }
    }
    addExtends('Button', element)
    expect(element.__ref.__extends).toEqual(['BaseComponent', 'Button'])
  })
})

describe('createElementExtends', () => {
  test('handles props.extends and adds them to element', () => {
    const element = {
      props: {
        extends: 'ButtonBase'
      },
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          ButtonBase: { base: true }
        }
      }
    }
    const result = createElementExtends(element, {})
    expect(result).toEqual(['Button', 'ButtonBase'])
  })

  test('handles variant in props when mapping components', () => {
    const element = {
      props: {
        variant: 'primary'
      },
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          'Button.primary': { primary: true },
          Button: { base: true }
        }
      }
    }
    const result = createElementExtends(element, {})
    expect(result).toEqual(['Button'])
  })

  test('falls back to parent context if element context is not defined', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      }
    }
    const parent = {
      context: {
        components: {
          Button: { base: true }
        }
      }
    }
    const result = createElementExtends(element, parent)
    expect(result).toEqual(['Button'])
  })

  test('filters out non-object extends after mapping', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button', 'NonExistent']
      },
      context: {
        components: {
          Button: { base: true }
        }
      }
    }
    const result = createElementExtends(element, {})
    expect(result).toEqual(['Button', 'NonExistent'])
  })

  test('creates basic extend stack', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {}
    }
    const parent = {}
    const stack = createElementExtends(element, parent)
    expect(stack).toEqual(['Button'])
  })

  test('incorporates context defaultExtends', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        defaultExtends: ['DefaultComponent'],
        components: {
          DefaultComponent: { default: true },
          Button: { button: true }
        }
      }
    }
    const parent = {}
    const stack = createElementExtends(element, parent)
    expect(stack).toEqual(['Button', 'DefaultComponent'])
  })

  test('combines childExtends from parent with element extends', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      },
      context: {
        components: {
          Base: { base: true },
          Child: { child: true }
        }
      }
    }
    const parent = {
      props: {
        childExtends: ['Child']
      }
    }
    const stack = createElementExtends(element, parent)
    expect(stack).toEqual(['Base', 'Child'])
  })

  test('handles recursive child extends', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      },
      context: {
        components: {
          Base: { base: true },
          Recursive: { recursive: true }
        }
      }
    }
    const parent = {
      childExtendsRecursive: ['Recursive']
    }
    const stack = createElementExtends(element, parent)
    expect(stack).toEqual(['Base', 'Recursive'])
  })

  test('respects ignoreChildExtends option', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      },
      context: {
        components: {
          Base: { base: true },
          Child: { child: true }
        }
      }
    }
    const parent = {
      props: {
        childExtends: ['Child']
      }
    }
    const options = {
      ignoreChildExtends: true
    }
    const stack = createElementExtends(element, parent, options)
    expect(stack).toEqual(['Base'])
  })

  test('handles complex inheritance chain with all extend types', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      },
      context: {
        components: {
          Base: { base: true },
          Child: { child: true },
          Recursive: { recursive: true },
          Default: { default: true }
        }
      }
    }
    const parent = {
      props: {
        childExtends: ['Child']
      },
      childExtendsRecursive: ['Recursive']
    }
    const stack = createElementExtends(element, parent)
    expect(stack).toEqual(['Base', 'Child', 'Recursive'])
  })

  test('maintains extends property in test environment', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'

    const element = {
      extends: 'ShouldRemain',
      props: {},
      __ref: {
        __extends: ['Base']
      },
      context: {
        components: {
          Base: { base: true }
        }
      }
    }
    const parent = {}
    createElementExtends(element, parent)

    expect(element.extends).toBe('ShouldRemain')

    process.env.NODE_ENV = originalEnv
  })
})

describe('createExtendsStack', () => {
  test('creates basic extend stack', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          Button: { base: true }
        }
      }
    }
    const parent = {}
    const stack = createExtendsStack(element, parent)
    expect(stack).toEqual([{ base: true }])
  })

  test('handles variant mapping', () => {
    const element = {
      props: {
        variant: 'primary'
      },
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          'Button.primary': { primary: true },
          Button: { base: true }
        }
      }
    }
    const parent = {}
    const stack = createExtendsStack(element, parent)
    expect(stack).toEqual([{ primary: true }])
  })

  test('removes duplicate extends', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button', 'Button']
      },
      context: {
        components: {
          Button: { base: true }
        }
      }
    }
    const parent = {}
    const stack = createExtendsStack(element, parent)
    expect(stack).toEqual([{ base: true }])
  })

  test('stores stack in __ref.__extendsStack', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          Button: { base: true }
        }
      }
    }
    const parent = {}
    createExtendsStack(element, parent)
    expect(element.__ref.__extendsStack).toEqual([{ base: true }])
  })

  test('handles non-existent component references', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['NonExistentButton']
      },
      context: {
        components: {}
      }
    }
    const parent = {}
    const stack = createExtendsStack(element, parent)
    expect(stack).toEqual([])
  })

  test('handles multiple extends with variants', () => {
    const element = {
      props: {
        variant: 'success'
      },
      __ref: {
        __extends: ['Button', 'Input']
      },
      context: {
        components: {
          'Button.success': { success: true, type: 'button' },
          'Input.success': { success: true, type: 'input' },
          Button: { base: true, type: 'button' },
          Input: { base: true, type: 'input' }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toEqual([
      { success: true, type: 'button' },
      { base: true, type: 'input' }
    ])
  })

  test('handles nested component references', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Form.Input.Text']
      },
      context: {
        components: {
          'Form.Input.Text': { type: 'text', nested: true },
          'Form.Input': { input: true },
          Form: { form: true }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toEqual([{ type: 'text', nested: true }])
  })

  test('handles extends with options.verbose in development', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

    const element = {
      props: {},
      __ref: {
        __extends: ['NonExistentComponent']
      },
      context: {
        components: {}
      }
    }
    const options = { verbose: true }
    createExtendsStack(element, {}, options)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Extend is string but component was not found:',
      'NonExistentComponent'
    )

    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  test('handles smbls prefixed components', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['smbls.Button']
      },
      context: {
        components: {
          'smbls.Button': { framework: true, type: 'button' }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toEqual([{ framework: true, type: 'button' }])
  })

  test('handles page components starting with slash', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['/Home']
      },
      context: {
        pages: {
          '/Home': { isPage: true, path: '/home' }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toEqual([{ isPage: true, path: '/home' }])
  })

  test('stores stack in __ref.__extendsStack and returns same reference', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          Button: { base: true }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toBe(element.__ref.__extendsStack)
    expect(stack).toEqual([{ base: true }])
  })

  test('handles combination of regular and variant components', () => {
    const element = {
      props: {
        variant: 'primary'
      },
      __ref: {
        __extends: ['Button', 'Icon']
      },
      context: {
        components: {
          'Button.primary': { primary: true, type: 'button' },
          Icon: { type: 'icon' }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toEqual([{ primary: true, type: 'button' }, { type: 'icon' }])
  })

  test('removes duplicates while preserving order', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button', 'Input', 'Button']
      },
      context: {
        components: {
          Button: { type: 'button' },
          Input: { type: 'input' }
        }
      }
    }
    const stack = createExtendsStack(element, {})
    expect(stack).toEqual([{ type: 'button' }, { type: 'input' }])
  })
})

describe('inheritChildExtends', () => {
  test('inherits childExtends from parent props', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      props: {
        childExtends: ['Child1', 'Child2']
      }
    }
    const result = inheritChildExtends(element, parent)
    expect(result).toEqual(['Base', 'Child1', 'Child2'])
  })

  test('inherits childExtends from parent object', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      childExtends: ['Child1', 'Child2']
    }
    const result = inheritChildExtends(element, parent)
    expect(result).toEqual(['Base', 'Child1', 'Child2'])
  })

  test('ignores inheritance when ignoreChildExtends is true', () => {
    const element = {
      props: {
        ignoreChildExtends: true
      },
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      props: {
        childExtends: ['Child1']
      },
      childExtends: ['Child2']
    }
    const result = inheritChildExtends(element, parent)
    expect(result).toEqual(['Base'])
  })
})

describe('inheritRecursiveChildExtends', () => {
  test('inherits recursive childExtends from parent props', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      props: {
        childExtendsRecursive: ['Recursive1']
      }
    }
    const result = inheritRecursiveChildExtends(element, parent)
    expect(result).toEqual(['Base', 'Recursive1'])
  })

  test('inherits recursive childExtends from parent object', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      childExtendsRecursive: ['Recursive1']
    }
    const result = inheritRecursiveChildExtends(element, parent)
    expect(result).toEqual(['Base', 'Recursive1'])
  })

  test('ignores recursive inheritance when ignoreChildExtendsRecursive is true', () => {
    const element = {
      props: {
        ignoreChildExtendsRecursive: true
      },
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      childExtendsRecursive: ['Recursive1']
    }
    const result = inheritRecursiveChildExtends(element, parent)
    expect(result).toEqual(['Base'])
  })

  test('ignores inheritance when childExtendsRecursive is false', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Base']
      }
    }
    const parent = {
      childExtendsRecursive: ['Recursive1']
    }
    const result = inheritRecursiveChildExtends(element, parent)
    expect(result).toEqual(['Base', 'Recursive1'])
  })
})

describe('finalizeExtends', () => {
  test('merges extendsStack into element', () => {
    const element = {
      prop1: 'original',
      __ref: {
        __extendsStack: [{ prop2: 'value2' }, { prop3: 'value3' }]
      }
    }
    const result = finalizeExtends(element, {})
    expect(result).toEqual({
      prop1: 'original',
      prop2: 'value2',
      prop3: 'value3',
      __ref: {
        __extendsStack: [{ prop2: 'value2' }, { prop3: 'value3' }]
      }
    })
  })

  test('handles nested object merging', () => {
    const element = {
      nested: {
        a: 1,
        b: { x: 1 }
      },
      __ref: {
        __extendsStack: [
          {
            nested: {
              b: { y: 2 },
              c: 3
            }
          }
        ]
      }
    }
    const result = finalizeExtends(element, {})
    expect(result.nested).toEqual({
      a: 1,
      b: { x: 1, y: 2 },
      c: 3
    })
  })

  test('preserves functions from extends', () => {
    const handler = () => 'handled'
    const element = {
      __ref: {
        __extendsStack: [{ onClick: handler }]
      }
    }
    const result = finalizeExtends(element, {})
    expect(result.onClick).toBe(handler)
    expect(result.onClick()).toBe('handled')
  })

  test('handles array merging', () => {
    const element = {
      items: [1, 2],
      __ref: {
        __extendsStack: [{ items: [3, 4] }]
      }
    }
    const result = finalizeExtends(element, {})
    expect(result.items).toEqual([1, 2, 3, 4])
  })

  test('handles multiple extends in correct order', () => {
    const element = {
      value: 'original',
      __ref: {
        __extendsStack: [
          { value: 'first', extra: 1 },
          { value: 'second', other: 2 }
        ]
      }
    }
    const result = finalizeExtends(element, {})
    expect(result).toEqual({
      value: 'original',
      extra: 1,
      other: 2,
      __ref: {
        __extendsStack: [
          { value: 'first', extra: 1 },
          { value: 'second', other: 2 }
        ]
      }
    })
  })
})

describe('applyExtends', () => {
  test('applies basic extends to element', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          Button: { type: 'button', color: 'primary' }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result).toEqual({
      props: {},
      __ref: {
        __extends: ['Button'],
        __extendsStack: [{ type: 'button', color: 'primary' }]
      },
      context: {
        components: {
          Button: { type: 'button', color: 'primary' }
        }
      },
      type: 'button',
      color: 'primary'
    })
  })

  test('handles complex inheritance chain', () => {
    const element = {
      props: {
        variant: 'primary'
      },
      __ref: {
        __extends: ['BaseButton']
      },
      context: {
        components: {
          BaseButton: { type: 'button', base: true },
          'BaseButton.primary': { color: 'blue', primary: true },
          CustomButton: { custom: true }
        }
      }
    }
    const parent = {
      props: {
        childExtends: ['CustomButton']
      }
    }

    const result = applyExtends(element, parent)

    // Check both the extends array and the merged properties
    expect(result.__ref.__extends).toEqual(['BaseButton', 'CustomButton'])
    expect(result.__ref.__extendsStack).toBeDefined()
    expect(result).toMatchObject({
      color: 'blue',
      primary: true,
      custom: true
    })
  })

  test('handles extends with context defaultExtends', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        defaultExtends: ['DefaultComponent'],
        components: {
          Button: { type: 'button' },
          DefaultComponent: { theme: 'light' }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result).toMatchObject({
      type: 'button',
      theme: 'light'
    })
  })

  test('handles recursive child extends', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Input']
      },
      context: {
        components: {
          Input: { type: 'input' },
          Themed: { theme: 'dark' }
        }
      }
    }
    const parent = {
      childExtendsRecursive: ['Themed']
    }
    const result = applyExtends(element, parent)
    expect(result.__ref.__extends).toEqual(['Input', 'Themed'])
    expect(result).toMatchObject({
      props: {},
      type: 'input',
      theme: 'dark'
    })
  })

  test('respects ignoreChildExtends option', () => {
    const element = {
      props: {
        ignoreChildExtends: true
      },
      __ref: {
        __extends: ['Base']
      },
      context: {
        components: {
          Base: { base: true }
        }
      }
    }
    const parent = {
      props: {
        childExtends: ['Child']
      },
      context: {
        components: {
          Child: { child: true }
        }
      }
    }
    const result = applyExtends(element, parent)
    expect(result).toMatchObject({
      base: true
    })
    expect(result).not.toHaveProperty('child')
  })

  test('handles multiple variant extends', () => {
    const element = {
      props: {
        variant: 'success'
      },
      __ref: {
        __extends: ['Button', 'Input']
      },
      context: {
        components: {
          'Button.success': { color: 'green' },
          'Input.success': { background: 'lightgreen' },
          Button: { type: 'button' },
          Input: { type: 'input' }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result).toMatchObject({
      color: 'green',
      type: 'input'
    })
  })

  test('maintains original properties while extending', () => {
    const element = {
      originalProp: 'stays',
      props: {},
      __ref: {
        __extends: ['Button']
      },
      context: {
        components: {
          Button: { newProp: 'added' }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result).toMatchObject({
      originalProp: 'stays',
      newProp: 'added'
    })
  })

  test('handles deep nested properties', () => {
    const element = {
      props: {},
      style: {
        color: 'red'
      },
      __ref: {
        __extends: ['StyledButton']
      },
      context: {
        components: {
          StyledButton: {
            style: {
              background: 'blue',
              padding: '10px'
            }
          }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result.style).toEqual({
      color: 'red',
      background: 'blue',
      padding: '10px'
    })
  })

  test('handles function properties', () => {
    const baseHandler = () => 'base'
    const element = {
      props: {},
      __ref: {
        __extends: ['Interactive']
      },
      context: {
        components: {
          Interactive: {
            onClick: baseHandler
          }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result.onClick).toBe(baseHandler)
    expect(result.onClick()).toBe('base')
  })

  test('processes entire extend chain in correct order', () => {
    const element = {
      props: {},
      __ref: {
        __extends: ['Level1']
      },
      context: {
        components: {
          Level1: {
            extends: 'Level2',
            first: true
          },
          Level2: {
            extends: 'Level3',
            second: true
          },
          Level3: {
            third: true
          }
        }
      }
    }
    const result = applyExtends(element, {})
    expect(result).toMatchObject({
      first: true,
      second: true,
      third: true
    })
  })
})

import { replaceLiteralsWithObjectFields } from '..'

describe('replaceLiteralsWithObjectFields', () => {
  it('should replace {{ }} placeholders with object values', () => {
    const str = 'Hello, {{ name }}! Today is {{ day }}.'
    const state = { name: 'John', day: 'Monday' }
    expect(replaceLiteralsWithObjectFields(str, state)).toBe(
      'Hello, John! Today is Monday.'
    )
  })

  it('should handle parent path traversal', () => {
    const state = {
      value: 'Child',
      parent: {
        value: 'Parent',
        parent: { value: 'GrandParent' }
      }
    }
    expect(replaceLiteralsWithObjectFields('{{ ../value }}', state)).toBe(
      'Parent'
    )
    expect(replaceLiteralsWithObjectFields('{{ ../../value }}', state)).toBe(
      'GrandParent'
    )
  })

  it('should handle triple brackets with parent path', () => {
    const state = {
      value: 'Child',
      parent: { value: 'Parent' }
    }
    expect(
      replaceLiteralsWithObjectFields('{{{ ../value }}}', state, {
        bracketsLength: 3
      })
    ).toBe('Parent')
  })

  it('should handle undefined values', () => {
    const str = '{{ missing }}'
    const state = { existing: 'value' }
    expect(replaceLiteralsWithObjectFields(str, state)).toBe('')
  })

  it('should handle non-existent parent paths', () => {
    const str = '{{ ../value }}'
    const state = { name: 'test' }
    expect(replaceLiteralsWithObjectFields(str, state)).toBe('')
  })

  it('should return original string when no bracket pattern matches', () => {
    const str = 'Hello, {value}!'
    const state = { value: 'world' }
    expect(replaceLiteralsWithObjectFields(str, state)).toBe('Hello, {value}!')
  })

  it('should handle whitespace in variables', () => {
    const str = '{{  spaced  }}'
    const state = { spaced: 'value' }
    expect(replaceLiteralsWithObjectFields(str, state)).toBe('value')
  })

  it('should handle undefined state parameter', () => {
    const str = '{{ value }}'
    expect(replaceLiteralsWithObjectFields(str)).toBe('')
  })

  it('replaces placeholders in a string with corresponding values from an object', () => {
    const str = 'Hello, {{ name }}! Today is {{ day }}.'
    const state = {
      name: 'John',
      day: 'Monday'
    }

    const result = replaceLiteralsWithObjectFields(str, state)

    expect(result).toEqual('Hello, John! Today is Monday.')
  })

  it('returns the original string if no placeholders are present', () => {
    const str = 'Hello, world!'
    const state = {
      name: 'John',
      day: 'Monday'
    }

    const result = replaceLiteralsWithObjectFields(str, state)

    expect(result).toEqual('Hello, world!')
  })

  it('returns an empty string if the parent level does not exist', () => {
    const str = 'Hello, {{ parent.child.name }}!'
    const state = {
      parent: null
    }

    const result = replaceLiteralsWithObjectFields(str, state)

    expect(result).toEqual('Hello, !')
  })

  it('handles parent path traversal correctly', () => {
    const str = 'Value: {{ ../parentValue }} and {{ value }}'
    const state = {
      value: 'child',
      parent: {
        parentValue: 'parent'
      }
    }

    const result = replaceLiteralsWithObjectFields(str, state)
    expect(result).toEqual('Value: parent and child')
  })

  it('handles multiple parent path traversal', () => {
    const str = 'Value: {{ ../../grandParentValue }}'
    const state = {
      parent: {
        parent: {
          grandParentValue: 'grand success'
        }
      }
    }

    const result = replaceLiteralsWithObjectFields(str, state)
    expect(result).toEqual('Value: grand success')
  })

  it('handles triple brackets', () => {
    const str = 'Value: {{{ value }}}'
    const state = {
      value: 'triple'
    }

    const result = replaceLiteralsWithObjectFields(str, state, {
      bracketsLength: 3
    })
    expect(result).toEqual('Value: triple')
  })

  it('respects enforceTagsFallback option', () => {
    const str = 'Value: {{ missing }}'
    const state = {}

    const result = replaceLiteralsWithObjectFields(str, state, {
      enforceTagsFallback: false
    })
    expect(result).toEqual('Value: ')
  })

  it('handles undefined state object', () => {
    const str = 'Value: {{ value }}'
    const result = replaceLiteralsWithObjectFields(str)
    expect(result).toEqual('Value: ')
  })

  it('handles nested object properties', () => {
    const str = 'Nested: {{ nested.value }}'
    const state = {
      nested: {
        value: 'works'
      }
    }

    const result = replaceLiteralsWithObjectFields(str, state)
    expect(result).toEqual('Nested: works')
  })

  it('handles multiple parent traversals in one string', () => {
    const str = '{{ ../../grandparent }} -> {{ ../parent }} -> {{ child }}'
    const state = {
      child: 'level0',
      parent: {
        value: 'level1', // This is what ../parent should resolve to
        parent: {
          grandparent: 'level2',
          value: 'level1'
        }
      }
    }

    const result = replaceLiteralsWithObjectFields(str, state)
    expect(result).toEqual('level2 -> level1 -> level0')
  })

  it('handles whitespace in placeholders', () => {
    const str = 'Value: {{   spaced   }}'
    const state = {
      spaced: 'trimmed'
    }

    const result = replaceLiteralsWithObjectFields(str, state)
    expect(result).toEqual('Value: trimmed')
  })
})

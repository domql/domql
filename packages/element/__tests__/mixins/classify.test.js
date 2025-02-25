import { classify } from '../../mixins/classList'

describe('classify', () => {
  it('handles empty objects', () => {
    expect(classify({}, null)).toBe('')
  })

  it('adds classes for truthy boolean values', () => {
    const obj = { active: true, disabled: false }
    expect(classify(obj, null)).toBe(' active')
  })

  it('adds string values directly', () => {
    const obj = { color: 'blue', spacing: 'm-2' }
    expect(classify(obj, null)).toBe(' blue m-2')
  })

  it('executes functions with element and includes results', () => {
    const element = { type: 'button' }
    const obj = {
      dynamic: el => `${el.type}-style`
    }
    expect(classify(obj, element)).toBe(' button-style')
  })

  it('combines different value types correctly', () => {
    const element = { size: 10 }
    const obj = {
      visible: true,
      theme: 'dark',
      size: el => `size-${el.size}`,
      disabled: false
    }
    expect(classify(obj, element)).toBe(' visible dark size-10')
  })

  it('handles empty string values', () => {
    const obj = { empty: '' }
    expect(classify(obj, null)).toBe(' ')
  })

  it('ignores non-boolean/string/function values', () => {
    const obj = {
      number: 42,
      array: ['a', 'b'],
      object: { key: 'value' },
      nullValue: null
    }
    expect(classify(obj, null)).toBe('')
  })

  it('handles functions returning multiple classes', () => {
    const obj = {
      multi: () => 'text-center p-4'
    }
    const element = { active: true, user: 'admin' }
    expect(classify(obj, element)).toBe(' text-center p-4')
  })

  it('handles complex element-dependent functions', () => {
    const element = { active: true, user: 'admin' }
    const obj = {
      status: el => (el.active ? 'active' : 'inactive'),
      access: el => `role-${el.user}`
    }
    expect(classify(obj, element)).toBe(' active role-admin')
  })

  it('handles all false boolean values', () => {
    const obj = { loading: false, error: false }
    expect(classify(obj, null)).toBe('')
  })
})

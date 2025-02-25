import { classList } from '../../mixins/classList'

describe('classList', () => {
  it('returns undefined for falsy params', () => {
    expect(classList(null, {})).toBeUndefined()
    expect(classList(undefined, {})).toBeUndefined()
    expect(classList(false, {})).toBeUndefined()
  })

  it('handles boolean true parameter', () => {
    const element = { key: 'submit-button' }
    const result = classList(true, element)
    expect(result).toBe('submit-button')
    expect(element.class).toEqual({ key: 'submit-button' })
  })

  it('handles string parameters', () => {
    const element = {}
    const result = classList('primary dark', element)
    expect(result).toBe('primary dark')
    expect(element.class).toEqual({ default: 'primary dark' })
  })

  it('processes object parameters with classify', () => {
    const element = { active: true }
    const params = {
      visible: true,
      theme: 'dark',
      size: el => (el.active ? 'large' : 'small')
    }
    const result = classList(params, element)
    expect(result).toBe('visible dark large')
  })

  it('handles element.ref legacy behavior', () => {
    const element = { ref: {}, class: 'existing' }
    classList('new-class', element)
    expect(element.ref.class).toBe('new-class')
  })

  it('normalizes whitespace in class names', () => {
    const element = {}
    const params = { '  multi-space  ': true }
    const result = classList(params, element)
    expect(result).toBe('multi-space')
  })

  it('combines multiple value types', () => {
    const element = { admin: true }
    const params = {
      active: true,
      'user-type': el => (el.admin ? 'admin' : 'user'),
      style: 'rounded shadow'
    }
    const result = classList(params, element)
    expect(result).toBe('active admin rounded shadow')
  })

  it('handles empty parameters gracefully', () => {
    const element = { key: 'empty' }
    expect(classList({}, element)).toBe('')
    expect(classList('', element)).toBe(undefined)
    expect(classList(true, { key: '' })).toBe('')
  })

  it('maintains existing class properties', () => {
    const element = { class: 'existing', key: 'test' }
    classList(true, element)
    expect(element.class).toEqual({ key: 'test' })
  })

  it('handles complex nested functions', () => {
    const element = { count: 3 }
    const params = {
      dynamic: el => `level-${el.count > 2 ? 'high' : 'low'}`
    }
    const result = classList(params, element)
    expect(result).toBe('level-high')
  })
})

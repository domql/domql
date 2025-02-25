import { applyClassListOnNode } from '../../mixins/classList'

describe('applyClassListOnNode()', () => {
  it('applies className to node and returns it', () => {
    const element = {}
    const node = { classList: '' }
    const params = { active: true, theme: 'dark' }

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('active dark')
    expect(node.classList).toBe('active dark')
  })

  it('handles empty params by setting empty className', () => {
    const element = {}
    const node = { classList: 'existing-class' }

    const result = applyClassListOnNode(null, element, node)

    expect(result).toBeUndefined()
    expect(node.classList).toBe(undefined)
  })

  it('overwrites existing classList on node', () => {
    const element = {}
    const node = { classList: 'old-class' }
    const params = { new: true }

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('new')
    expect(node.classList).toBe('new')
  })

  it('handles string params correctly', () => {
    const element = {}
    const node = { classList: '' }
    const params = 'primary large'

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('primary large')
    expect(node.classList).toBe('primary large')
  })

  it('handles boolean true params', () => {
    const element = { key: 'submit-button' }
    const node = { classList: '' }

    const result = applyClassListOnNode(true, element, node)

    expect(result).toBe('submit-button')
    expect(node.classList).toBe('submit-button')
  })

  it('handles complex object params with dynamic class generation', () => {
    const element = { size: 10 }
    const node = { classList: '' }
    const params = {
      visible: true,
      theme: 'dark',
      size: el => `size-${el.size}`
    }

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('visible dark size-10')
    expect(node.classList).toBe('visible dark size-10')
  })

  it('handles empty className from classList()', () => {
    const element = {}
    const node = { classList: 'existing-class' }
    const params = {}

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('')
    expect(node.classList).toBe('')
  })

  it('preserves node object structure', () => {
    const element = {}
    const node = { classList: '', otherProp: 'unchanged' }
    const params = { active: true }

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('active')
    expect(node.classList).toBe('active')
    expect(node.otherProp).toBe('unchanged')
  })

  it('handles falsy params by clearing classList', () => {
    const element = {}
    const node = { classList: 'existing-class' }

    const result = applyClassListOnNode(false, element, node)

    expect(result).toBeUndefined()
    expect(node.classList).toBe(undefined)
  })

  it('handles complex element-dependent functions', () => {
    const element = { active: true, user: 'admin' }
    const node = { classList: '' }
    const params = {
      status: el => (el.active ? 'active' : 'inactive'),
      access: el => `role-${el.user}`
    }

    const result = applyClassListOnNode(params, element, node)

    expect(result).toBe('active role-admin')
    expect(node.classList).toBe('active role-admin')
  })
})

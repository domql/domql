import { exec } from '..'

test('should check whether value is executable and if yes, return executed value', () => {
  const val1 = exec('val1', {})
  const val2 = exec(() => 'val2', {})

  expect(val1).toEqual('val1')
  expect(val2).toEqual('val2')
})

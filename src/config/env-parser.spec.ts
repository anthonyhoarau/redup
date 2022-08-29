/* eslint-disable no-undef */
import {parseEnv} from './env-parser'

describe('parseEnv', () => {
  test('should return key:value object from content', () => {
    const content = 'FOO=BAR'
    expect(parseEnv(content)).toEqual({ FOO: 'BAR' })
  })

  test('should return key:value object from content with quote', () => {
    const content = 'FOO="BAR"'
    expect(parseEnv(content)).toEqual({ FOO: 'BAR' })
  })

  test('should return key:value object from content with multiple lines', () => {
    const content = `
      FOO="BAR"
      BAZ=BARE
    `
    expect(parseEnv(content)).toEqual({ FOO: 'BAR', BAZ: 'BARE' })
  })
})

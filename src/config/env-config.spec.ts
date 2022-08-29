import * as fs from 'node:fs'
import {envConfig} from './env-config'
import * as path from 'node:path'

describe('Config', () => {
  let readFileSpy: jest.SpyInstance;

  beforeEach(() => {
    readFileSpy = jest.spyOn(fs, 'readFileSync')
    readFileSpy.mockReturnValue('foo=bar')
  })

  test('should read config from path with correct encoding', () => {
    const configPath = 'myPath/.reduprc'
    jest.spyOn(path, 'resolve').mockReturnValue(configPath)
    envConfig()
    expect(readFileSpy).toHaveBeenCalledWith(configPath, { encoding: 'utf-8' })
  })
})

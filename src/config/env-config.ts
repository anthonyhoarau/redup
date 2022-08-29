import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseEnv } from './env-parser'
import { KeyValue } from '../common/interfaces/core'

const envFile = '.reduprc'

export function envConfig (): {parsed: KeyValue} | {error: unknown} {
  const encoding = 'utf-8'
  const envPath = path.resolve(process.cwd(), envFile)

  try {
    const parsed = parseEnv(fs.readFileSync(envPath, { encoding }))

    overrideProcessEnv(parsed)

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

function overrideProcessEnv (parsed: { [key: string]: string }, options: {debug: boolean, override: boolean} = { debug: false, override: true }): void {
  Object.keys(parsed).forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = parsed[key]
    } else {
      if (options.override) {
        process.env[key] = parsed[key]
      }

      if (options.debug) {
        if (options.override) {
          console.log(`"${key}" is already defined in \`process.env\` and WAS overwritten`)
        } else {
          console.log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`)
        }
      }
    }
  })
}

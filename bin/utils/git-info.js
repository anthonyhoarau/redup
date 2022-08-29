import * as util from 'node:util'
import { exec } from 'node:child_process'
const execPromise = util.promisify(exec)

export async function currentBranchName () {
  const cmd = 'git branch --show-current'
  const { stdout, stderr } = await execPromise(cmd)
  if (stderr) {
    console.log(`error: ${stderr}`)
    return false
  }
  return stdout
}

export async function headRevisionId () {
  const cmd = 'git rev-parse HEAD'
  const { stdout, stderr } = await execPromise(cmd)
  if (stderr) {
    console.log(`error: ${stderr}`)
    return false
  }
  return stdout
}

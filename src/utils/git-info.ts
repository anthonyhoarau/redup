import * as util from 'node:util'
import { exec } from 'node:child_process'

const execPromise = util.promisify(exec)

export async function currentBranchName (): Promise<string> {
  const cmd = 'git branch --show-current'
  const { stdout, stderr } = await execPromise(cmd)
  if (stderr !== '') {
    throw new Error(stderr)
  }
  return stdout.trim()
}

export async function headRevisionId (): Promise<string | null> {
  const cmd = 'git rev-parse HEAD'
  const { stdout, stderr } = await execPromise(cmd)
  if (stderr !== '') {
    return null
  }
  return stdout
}

/**
 * Issue actions is based on branch name or revision number.
 * Before doing any process, the branch must be a valid one.
 * @return branch name if the branch is valid, null otherwise.
 */
export async function isValidBranch (): Promise<boolean> {
  const branchName = await currentBranchName()
  const pattern = /(feat(ure)?|(bug)?fix|chore)\//
  return pattern.exec(branchName) != null
}

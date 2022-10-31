import * as chalk from 'chalk'
import { Command } from 'commander'

export function extractRedmineIdFromBranch (program: Command, branchName: string): string {
  const pattern = /(feat(ure)?|(bug)?fix|chore)\/(RM|rm)-?(?<issueId>\d+)/
  const redmineId = pattern.exec(branchName)?.groups?.issueId

  if (redmineId == null) {
    program.error(chalk.red.bold('Unable to find redmine in current branch name.\nBranch must be a feature branch, following naming convention.'))
  }

  return redmineId
}

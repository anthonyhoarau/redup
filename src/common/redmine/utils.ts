import * as chalk from 'chalk'
import { Command } from 'commander'

export function extractRedmineIdFromFeatureBranch (program: Command, branchName: string): string {
  const pattern = /feature\/(RM|rm)-?(?<issueId>\d+)/
  const redmineId = pattern.exec(branchName)?.groups?.issueId

  if (redmineId == null) {
    program.error(chalk.red.bold('Unable to find redmine in current branch name.\nBranch must be a feature branch, following naming convention.'))
  }

  return redmineId
}

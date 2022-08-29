import * as chalk from 'chalk'

export function extractRedmineIdFromFeatureBranch (branchName: string): string {
  const pattern = /feature\/(RM|rm)-?(?<issueId>\d+)/
  const redmineId = pattern.exec(branchName)?.groups?.issueId

  if (redmineId == null) {
    console.log(chalk.red.bold('Unable to find redmine in current branch name.\nBranch must be a feature branch, following naming convention.'))
    process.exit(1)
  }

  return redmineId
}

import * as chalk from 'chalk'
import { isValidBranch } from '../../utils/git-info'
import { Command } from 'commander'

/**
 * If current branch is not a branch compatible with issue tools
 * continue the other processes, do not abort any git action for it.
 */
export async function mandatoryCheckBeforeAnyCommand (program: Command): Promise<void> {
  if (process.env.UPSOURCE_HOST == null) {
    program.error(chalk.red.bold('Missing \'UPSOURCE_HOST\' config. Please verify your .reduprc config'))
  }

  if (process.env.UPSOURCE_PROJECT_ID == null) {
    program.error(chalk.red.bold('Missing \'UPSOURCE_PROJECT_ID\' config. Please verify your .reduprc config'))
  }

  if (process.env.UPSOURCE_USER_API_TOKEN == null) {
    program.error(chalk.red.bold('Missing \'UPSOURCE_USER_API_TOKEN\' config. Please verify your .env config'))
  }

  if (process.env.REDMINE_HOST == null) {
    program.error(chalk.red.bold('Missing \'REDMINE_HOST\' config. Please verify your .reduprc config'))
  }

  if (process.env.REDMINE_USER_API_TOKEN == null) {
    program.error(chalk.red.bold('Missing \'REDMINE_USER_API_TOKEN\' config. Please verify your .reduprc config'))
  }

  const isBranchValid = await isValidBranch()
  if (!isBranchValid) {
    program.error('INFO - Issue Tools: current git branch is not a candidate to process automatic Issue update.', { exitCode: 0 })
  }
}

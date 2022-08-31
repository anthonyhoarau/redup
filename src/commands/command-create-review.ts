import { currentBranchName } from '../utils/git-info'
import * as chalk from 'chalk'
import { extractRedmineIdFromFeatureBranch } from '../common/redmine/utils'
import redmineUpdateIssue from '../common/redmine/redmine-update-issue'
import { RedmineStatus } from '../common/redmine/types/redmine-status'
import { Command } from 'commander'
// import upsourceCreateBranchReview from '../common/upsource/upsource-create-review'

export default function commandCreateReview (): Command {
  const program = new Command('create-review')
  program
    .description('Create a review in Upsource based on latest branch revision number')
    .action(async () => await createReview(program))
  return program
}

async function createReview (program: Command): Promise<void> {
  const branchName = await currentBranchName()
  console.log(chalk.blue(`Create review for branch: ${branchName}`))

  // await upsourceCreateBranchReview(branchName)

  const redmineId = extractRedmineIdFromFeatureBranch(branchName)

  try {
    await redmineUpdateIssue(redmineId, {
      notes: `Code review available at https://${process.env.UPSOURCE_HOST}/review/reviewId`,
      status_id: RedmineStatus.REVIEW_AVAILABLE
    })

    console.log(chalk.red.bold(`Redmine updated: https://${process.env.REDMINE_HOST}/issues/${redmineId}`))
  } catch (e) {
    program.error(chalk.red.bold(`Unable to update redmine https://${process.env.REDMINE_HOST}/issues/${redmineId}`))
  }
}

import { currentBranchName } from '../utils/git-info'
import * as chalk from 'chalk'
import { extractRedmineIdFromFeatureBranch } from '../common/redmine/utils'
import redmineUpdateIssue from '../common/redmine/redmine-update-issue'
import { RedmineStatus } from '../common/redmine/types/redmine-status'
import upsourceCreateBranchReview from '../common/upsource/upsource-create-review'

export default async function createReview (): Promise<void> {
  const branchName = await currentBranchName()
  console.log(chalk.blue(`Create review for branch: ${branchName}`))

  await upsourceCreateBranchReview(branchName)

  const redmineId = extractRedmineIdFromFeatureBranch(branchName)
  await redmineUpdateIssue(redmineId, { notes: 'Code review Available https://upsource.eu1.mrva.tech/', status_id: RedmineStatus.REVIEW_AVAILABLE })
}

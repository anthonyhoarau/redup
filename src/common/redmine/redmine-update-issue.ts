import { RedmineIssueRequest } from './types/redmine-issue-request'
import * as chalk from 'chalk'
import { apiRest } from '../http-helper/api-request'

export default async function redmineUpdateIssue (issueId: string, issue: RedmineIssueRequest): Promise<void> {
  const hostname = process.env.REDMINE_HOST
  const redmineUserToken = process.env.REDMINE_USER_API_TOKEN

  console.log(chalk.gray(`Updating Redmine status of issue: ${issueId}`))

  await apiRest<{issue: RedmineIssueRequest}, never>({
    hostname,
    path: `/issues/${issueId}.json`,
    type: 'PUT',
    data: { issue },
    customHeader: {
      'X-Redmine-API-Key': redmineUserToken
    }
  })

  console.log(chalk.green.bold(`Redmine updated: https://${hostname}/issues/${issueId}`))
}

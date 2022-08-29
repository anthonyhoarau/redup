import { RedmineIssueRequest } from './types/redmine-issue-request'
import * as chalk from 'chalk'
import * as https from 'https'

export default async function redmineUpdateIssue (issueId: string, issue: RedmineIssueRequest): Promise<void> {
  return await new Promise((resolve, reject) => {
    const hostname = process.env.REDMINE_HOST
    const redmineUserToken = process.env.REDMINE_USER_API_TOKEN

    const requestData = JSON.stringify({
      issue
    })

    const requestOption = {
      hostname,
      path: `/issues/${issueId}.json`,
      method: 'PUT',
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestData.length,
        'X-Redmine-API-Key': redmineUserToken
      }
    }

    console.log(chalk.gray(`Updating Redmine status of issue: ${issueId}`))

    const request = https.request(requestOption, response => {
      response.on('data', rawData => {
        const response = JSON.parse(rawData.toString())
        console.log(response)
        return resolve()
        /* if (response?.error) {
          program.error(chalk.red.bold(response?.error.message))
        }

        const reviewId = response.result.reviewId.reviewId
        console.log(chalk.green.bold(`Review ${reviewId} successfully created`))
        console.log(chalk.green.bold(`Review link: https://${UPSOURCE_HOST}/${upsourceProjectId}/review/${reviewId}`)) */
      })
    })

    request.on('error', error => {
      console.log(error)
      return reject(error)
    })

    request.write(requestData)
    request.end()
  })
}

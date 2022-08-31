import { RedmineIssueRequest } from './types/redmine-issue-request'
import * as chalk from 'chalk'
import * as https from 'https'
import { IncomingMessage } from 'http'

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
      },
      rejectUnauthorized: process.env.REJECT_UNAUTHORIZED_SSL == null || process.env.REJECT_UNAUTHORIZED_SSL === 'true'
    }

    console.log(chalk.gray(`Updating Redmine status of issue: ${issueId}`))

    const request = https.request(requestOption, (res: IncomingMessage) => {
      // reject on bad status
      const statusCode = +res.statusCode
      if (statusCode < 200 || statusCode >= 300) {
        return reject(new Error(`statusCode=${statusCode}`))
      }

      // cumulate data
      const bodyChunk = []
      res.on('data', function (chunk: unknown) {
        bodyChunk.push(chunk)
      })

      // resolve on end
      res.on('end', function () {
        let body: {[key: string]: unknown} | null = null
        try {
          if (bodyChunk.length > 0) {
            body = JSON.parse(Buffer.concat(bodyChunk).toString())
          }
        } catch (e) {
          reject(e)
        }
        resolve()
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

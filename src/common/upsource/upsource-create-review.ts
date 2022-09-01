import * as chalk from 'chalk'
import { apiRest } from '../http-helper/api-request'
import { UpsourceCreateReviewRequest } from './types/upsource-request'
import { UpsourceApiResponse } from './types/upsource-response'
import { Command } from 'commander'

export default async function upsourceCreateMergeReview (program: Command, branchName: string): Promise<void> {
  const hostname = process.env.UPSOURCE_HOST
  const projectId = process.env.UPSOURCE_PROJECT_ID
  const upsourceUserToken = process.env.UPSOURCE_USER_API_TOKEN

  console.log(chalk.gray(`Creating Upsource review for branch ${branchName}`))

  const apiResponse = await apiRest<UpsourceCreateReviewRequest, UpsourceApiResponse>({
    hostname,
    path: '/~rpc/createReview',
    type: 'POST',
    data: { projectId, branch: branchName, mergeToBranch: 'develop' },
    customHeader: {
      Authorization: `Bearer ${upsourceUserToken}`
    }
  })

  if (apiResponse?.error) {
    program.error(chalk.red.bold(`Upsource: ${apiResponse.error.message}`))
  }

  const reviewId = apiResponse.result?.reviewId?.reviewId
  console.log(chalk.green.bold(`Review ${reviewId || ''} successfully created`))
  if (reviewId) {
    console.log(chalk.green.bold(`Review link: https://${hostname}/${projectId}/review/${reviewId}`))
  }
}

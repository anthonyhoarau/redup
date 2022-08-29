import * as chalk from 'chalk'
import * as https from 'https'

export default async function upsourceCreateBranchReview (branchName: string): Promise<void> {
  return await new Promise((resolve, reject) => {
    const hostname = process.env.UPSOURCE_HOST as string
    const projectId = process.env.UPSOURCE_PROJECT_ID as string
    const upsourceUserToken = process.env.UPSOURCE_USER_API_TOKEN as string

    const requestData = JSON.stringify({
      projectId,
      branch: branchName,
      mergeToBranch: 'develop'
    })

    const requestOption = {
      hostname,
      path: '/~rpc/createReview',
      method: 'POST',
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestData.length,
        Authorization: `Bearer ${upsourceUserToken}`
      }
    }

    console.log(chalk.gray(`Creating Upsource review for branch ${branchName}`))

    const request = https.request(requestOption, response => {
      response.on('data', rawData => {
        const responseData = JSON.parse(rawData.toString())
        console.log(responseData)

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (responseData?.error) {
          console.log(chalk.red.bold(responseData.error.message))
          return reject(responseData.error)
        }

        const reviewId = responseData.result.reviewId.reviewId as string
        console.log(chalk.green.bold(`Review ${reviewId} successfully created`))
        console.log(chalk.green.bold(`Review link: https://${hostname}/${projectId}/review/${reviewId}`))
        return resolve()
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

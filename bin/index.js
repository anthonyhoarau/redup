#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import * as https from 'node:https'
import { currentBranchName } from './utils/git-info.js'

const UPSOURCE_HOST = 'upsource.eu1.mrva.tech'

const program = new Command()

program
  .name('issue-tracker')
  .description('CLI to update issue on Redmine and Upsource')
  .version('0.0.1')
  .hook('preAction', mandatoryCheckBeforeAnyCommand)

program.command('create-review')
  .description('Create a review in Upsource based on latest branch revision number')
  .action(createReview)

program.parse()

/**
 * If current branch is not a branch compatible with issue tools
 * continue the other processes, do not abort any git action for it.
 */
async function mandatoryCheckBeforeAnyCommand () {
  if (!process.env.UPSOURCE_PROJECT_ID) {
    program.error(chalk.red.bold('Missing \'UPSOURCE_PROJECT_ID\' config. Please verify your .env config'))
  }

  if (!process.env.UPSOURCE_USER_API_TOKEN) {
    program.error(chalk.red.bold('Missing \'UPSOURCE_USER_API_TOKEN\' config. Please verify your .env config'))
  }

  if (!process.env.REDMINE_USER_API_TOKEN) {
    program.error(chalk.red.bold('Missing \'REDMINE_USER_API_TOKEN\' config. Please verify your .env config'))
  }

  const isBranchValid = await isValidBranch()
  if (!isBranchValid) {
    program.error('INFO - Issue Tools: current git branch is not a candidate to process automatic Issue update.', { exitCode: 0 })
  }
}

/**
 * Issue actions is based on branch name or revision number.
 * Before doing any process, the branch must be a valid one.
 * @return branch name if the branch is valid, null otherwise.
 */
async function isValidBranch () {
  const branchName = await currentBranchName()
  const pattern = /feature\//
  return !!pattern.exec(branchName)
}

function extractRedmineIdFromFeatureBranch (branchName) {
  const pattern = /feature\/RM|rm-?(?<issueId>\d+)/
  const redmineId = pattern.exec(branchName)?.groups?.issueId

  if (!redmineId) {
    program.error(chalk.red.bold('Unable to find redmine in current branch name.\nBranch must be a feature branch, following naming convention.'))
  }

  return redmineId
}

async function createReview () {
  const branchName = await currentBranchName()
  const redmineId = extractRedmineIdFromFeatureBranch(branchName)
  doUpsourceCreateMergeReview(branchName) // To be async
  doRedmineUpdateIssueStatus(redmineId) // To be async
}

function doUpsourceCreateMergeReview (branchName) {
  branchName = 'feature/table-custom-group-template'
  const upsourceProjectId = process.env.UPSOURCE_PROJECT_ID
  const upsourceUserToken = process.env.UPSOURCE_USER_API_TOKEN

  const requestDto = JSON.stringify({
    projectId: upsourceProjectId,
    branch: branchName,
    mergeToBranch: 'develop'
  })

  const upsourceRequestOption = {
    hostname: UPSOURCE_HOST,
    path: '/~rpc/createReview',
    method: 'POST',
    port: 443,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': requestDto.length,
      Authorization: `Bearer ${upsourceUserToken}`
    }
  }

  console.log(chalk.gray(`Creating Upsource review for branch ${branchName}`))

  const request = https.request(upsourceRequestOption, response => {
    response.on('data', rawData => {
      const response = JSON.parse(rawData.toString())
      if (response?.error) {
        program.error(chalk.red.bold(response?.error.message))
      }

      const reviewId = response.result.reviewId.reviewId
      console.log(chalk.green.bold(`Review ${reviewId} successfully created`))
      console.log(chalk.green.bold(`Review link: https://${UPSOURCE_HOST}/${upsourceProjectId}/review/${reviewId}`))
    })
  })

  request.on('error', error => {
    program.error(error.message)
  })

  request.write(requestDto)
  request.end()
}

function doRedmineUpdateIssueStatus (redmineId) {

}

import { RedmineStatus } from './redmine-status'

export interface RedmineIssueRequest {
  status_id: RedmineStatus
  notes: string
}

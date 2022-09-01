export interface UpsourceApiResponse {
  result: UpsourceCreateReviewResponse
  error: UpsourceErrorResponse
}

export interface UpsourceErrorResponse {
  code: number
  message: string
}

export interface UpsourceCreateReviewResponse {
  reviewId: { reviewId: string }
  projectId: string
}

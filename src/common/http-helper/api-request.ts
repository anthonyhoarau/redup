import { IncomingMessage } from 'http'
import * as https from 'https'

export interface ApiRequest<R> {
  hostname: string
  path: string
  type?: 'GET' | 'POST' | 'PUT'
  data: R
  port?: number
  customHeader?: {[key: string]: string | string[]}
}

export async function apiRest<R = any, T = any> (request: ApiRequest<R>): Promise<T> {
  const defaultRequest = {
    type: 'GET',
    port: 443,
    customHeader: {}
  }
  const requestOption = { ...defaultRequest, ...request }

  return await new Promise((resolve, reject) => {
    const requestData = JSON.stringify(request.data)

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': requestData.length
    }
    const headers = { ...defaultHeaders, ...requestOption?.customHeader }

    const httpRequestConfig = {
      hostname: request.hostname,
      path: request.path,
      method: requestOption.type,
      port: requestOption.port,
      headers,
      rejectUnauthorized: process.env.REJECT_UNAUTHORIZED_SSL == null || process.env.REJECT_UNAUTHORIZED_SSL === 'true'
    } as unknown as https.RequestOptions

    const httpRequest = https.request(httpRequestConfig, (res: IncomingMessage) => {
      // reject on bad status
      const statusCode = +res.statusCode
      if (statusCode < 200 || statusCode >= 300) {
        return reject(new Error(`statusCode=${statusCode}`))
      }

      // cumulate data
      const bodyChunk: Uint8Array[] = []
      res.on('data', function (chunk: Uint8Array) {
        bodyChunk.push(chunk)
      })

      // resolve on end
      res.on('end', function () {
        let body: T | null = null
        try {
          if (bodyChunk.length > 0) {
            body = JSON.parse(Buffer.concat(bodyChunk).toString())
          }
        } catch (e) {
          reject(e)
        }
        resolve(body)
      })

      httpRequest.on('error', error => {
        return reject(error)
      })

      httpRequest.write(requestData)
      httpRequest.end()
    })
  })
}

import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { type Context } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { endTime, startTime, timing } from 'hono/timing'
import { type StatusCode as StatusCodeHono } from 'hono/utils/http-status'

import { statusCode, swaggerConfig } from './httpConfig'
import { type HttpServerInterface } from './HttpServerInterface'

export class HonoAdapter implements HttpServerInterface {
  private readonly app: OpenAPIHono

  constructor () {
    this.app = new OpenAPIHono()
    this.app.use('*', cors())
    this.app.use('*', compress())
    this.app.use('*', logger())
    this.app.use('*', timing())
    this.app.use('*', prettyJSON())
    this.app.use('*', secureHeaders())
    this.app.use('*', etag())
  }

  on (route: any, callback: any): void {
    this.app.doc('/doc', swaggerConfig)
    this.app.openapi(
      route,
      async (context: Context) => {
        try {
          startTime(context, 'request', 'start request')
          const params = context.req.param()
          const config = {
            ...(Object.keys(params).length && { params }),
            ...(route.method !== 'get' && { body: await context.req.json() })
          }
          const output = await callback({ ...config })
          const result = context.json(output)
          endTime(context, 'request')
          return result
        } catch (error: any) {
          throw new HTTPException(statusCode.INTERNAL_SERVER_ERROR as StatusCodeHono, {
            message: error.message,
            cause: error
          })
        }
      }
    )
    this.app.get('/docs', swaggerUI({ url: '/doc' }))
    this.app.notFound((context: Context) => {
      return context.json({
        message: 'not_found'
      }, {
        status: statusCode.NOT_FOUND
      })
    })
    this.app.onError((error: Error, context: Context) => {
      if (error instanceof HTTPException) {
        return context.json({
          message: error.message
        }, {
          status: error.status
        })
      }
      return context.json({
        message: 'internal_server_error'
      }, {
        status: statusCode.INTERNAL_SERVER_ERROR
      })
    })
  }

  listen (port: number): void {
    serve({
      fetch: this.app.fetch,
      port
    })
    console.log(`Server is running on port ${port}`)
  }
}

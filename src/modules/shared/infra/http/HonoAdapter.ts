import { type Context, Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { timing } from 'hono/timing'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { HTTPException } from 'hono/http-exception'
import { type HttpServerInterface } from './HttpServerInterface'
import { StatusCode } from './StatusCode'
import { type StatusCode as StatusCodeHono } from 'hono/utils/http-status'

export class HonoAdapter implements HttpServerInterface {
  private readonly app: Hono

  constructor () {
    this.app = new Hono()
    this.app.use('*', cors())
    this.app.use('*', compress())
    this.app.use('*', logger())
    this.app.use('*', timing())
    this.app.use('*', prettyJSON())
    this.app.use('*', secureHeaders())
  }

  on (method: string, path: string, callback: Function): void {
    const handlerMethod = this.handlerMethod(method)
    if (!handlerMethod) {
      throw new HTTPException(
        StatusCode.METHOD_NOT_ALLOWED as StatusCodeHono, {
          message: 'method_not_allowed'
        })
    }
    handlerMethod(path, async (context: Context) => {
      try {
        const body = await context.req.json()
        const output = await callback(null, body)
        return context.json(output)
      } catch (error: any) {
        throw new HTTPException(StatusCode.INTERNAL_SERVER_ERROR as StatusCodeHono, {
          message: error.message,
          cause: error
        })
      }
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
        status: StatusCode.INTERNAL_SERVER_ERROR
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

  private handlerMethod (method: string): Function | undefined {
    const methodTransformed = method.toLowerCase()
    switch (methodTransformed) {
      case 'get': return this.app.get
      case 'post': return this.app.post
      case 'put': return this.app.put
      case 'patch': return this.app.patch
      case 'delete': return this.app.delete
      default: return undefined
    }
  }
}

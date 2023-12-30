import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { timing } from 'hono/timing'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { type HttpServerInterface } from './HttpServerInterface'

export class HonoAdapter implements HttpServerInterface {
  app: any

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
    this.app[method.toLowerCase()](path, async (context: any) => {
      try {
        const body = await context.req.json()
        const output = await callback(null, body)
        return context.json(output)
      } catch (error) {
        console.error('Error processing request:', error)
        context.res.status(500).json({ error: 'Internal Server Error' })
      }
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

import { type HttpServerInterface } from '@modules/shared'
import { type GetUserUseCase, type PersistUserUseCase } from '../application'
import { type InputPersistUserDto } from '../application/useCase/persistUser/PersistUserDto'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { type Next } from 'hono'
import { type Params } from 'hono/router'

const userSchemaPost = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
})

export class UserHttpController {
  private readonly httpServer: HttpServerInterface
  private readonly persistUserUseCase: PersistUserUseCase
  private readonly getUserUseCase: GetUserUseCase
  private readonly resource = '/users'

  constructor (
    httpServer: HttpServerInterface,
    persistUserUseCase: PersistUserUseCase,
    getUserUseCase: GetUserUseCase
  ) {
    this.httpServer = httpServer
    this.persistUserUseCase = persistUserUseCase
    this.getUserUseCase = getUserUseCase

    this.httpServer.on(
      'POST',
      this.resource,
      zValidator('json', userSchemaPost, (result, context) => {
        if (!result.success) context.json({ message: 'invalid_input' }, { status: 400 })
      }),
      async ({ body }: { body: InputPersistUserDto }) => {
        const { id, ...input } = body
        const output = await this.persistUserUseCase.execute(input)
        return output
      }
    )

    this.httpServer.on(
      'PATCH',
      `${this.resource}/:id`,
      zValidator('json', userSchemaPost, (result, context) => {
        if (!result.success) context.json({ message: 'invalid_input' }, { status: 400 })
      }),
      async ({ params, body }: { params: Params, body: InputPersistUserDto }) => {
        const { id } = params
        const output = await this.persistUserUseCase.execute({ ...body, id })
        return output
      }
    )

    this.httpServer.on(
      'GET',
      `${this.resource}/:id`,
      async (_: any, next: Next) => { await next() },
      async ({ params }: { params: Params }) => {
        const { id } = params
        const output = await this.getUserUseCase.execute({ id })
        return output
      }
    )
  }
}

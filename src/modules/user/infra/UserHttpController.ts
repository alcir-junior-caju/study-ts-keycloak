import { createRoute } from '@hono/zod-openapi'
import { type HttpServerInterface } from '@modules/shared'
import { type Params } from 'hono/router'
import { z } from 'zod'

import { type GetUserUseCase, type PersistUserUseCase } from '../application'
import { type InputPersistUserDto } from '../application/useCase/persistUser/PersistUserDto'

const userSchemaRequest = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
})

const userSchemaResponse = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

const userSchemaError = z.object({
  success: z.boolean(),
  error: z.object({
    issues: z.array(
      z.object({
        code: z.string(),
        expected: z.string(),
        received: z.string(),
        path: z.array(z.string()),
        message: z.string()
      })
    ),
    name: z.string()
  })
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
      createRoute({
        method: 'post',
        path: this.resource,
        tags: ['Users'],
        request: {
          body: {
            content: {
              'application/json': {
                schema: userSchemaRequest
              }
            },
            description: 'Create a new user'
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: userSchemaResponse
              }
            },
            description: 'User created'
          },
          400: {
            content: {
              'application/json': {
                schema: userSchemaError
              }
            },
            description: 'Invalid input'
          }
        }
      }),
      async ({ body }: { body: InputPersistUserDto }) => {
        const { id, ...input } = body
        const output = await this.persistUserUseCase.execute(input)
        return output
      }
    )

    this.httpServer.on(
      createRoute({
        method: 'patch',
        path: `${this.resource}/:id`,
        tags: ['Users'],
        request: {
          params: z.object({
            id: z.string().uuid()
          }),
          body: {
            content: {
              'application/json': {
                schema: userSchemaRequest
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: userSchemaResponse
              }
            },
            description: 'User updated'
          },
          400: {
            content: {
              'application/json': {
                schema: userSchemaError
              }
            },
            description: 'Invalid input'
          },
          404: {
            content: {
              'application/json': {
                schema: z.object({
                  message: z.string()
                })
              }
            },
            description: 'User not found'
          }
        }
      }),
      async ({ params, body }: { params: Params, body: InputPersistUserDto }) => {
        const { id } = params
        const output = await this.persistUserUseCase.execute({ ...body, id })
        return output
      }
    )

    this.httpServer.on(
      createRoute({
        method: 'get',
        path: `${this.resource}/:id`,
        tags: ['Users'],
        request: {
          params: z.object({
            id: z.string().uuid()
          })
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: userSchemaResponse
              }
            },
            description: 'User found'
          },
          400: {
            content: {
              'application/json': {
                schema: userSchemaError
              }
            },
            description: 'Invalid input'
          },
          404: {
            content: {
              'application/json': {
                schema: z.object({
                  message: z.string()
                })
              }
            },
            description: 'User not found'
          }
        }
      }),
      async ({ params }: { params: Params }) => {
        const { id } = params
        const output = await this.getUserUseCase.execute({ id })
        return output
      }
    )
  }
}

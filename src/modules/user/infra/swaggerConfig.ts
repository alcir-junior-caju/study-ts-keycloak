import { z } from 'zod'

const resource = '/users'
const tags = ['Users']

const userSchemaRequest = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  taxId: z.string().min(11)
})

const userSchemaResponse = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  taxId: z.string().min(11),
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

// export const userPostRoute = {
//   method: 'post',
//   path: resource,
//   tags,
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: userSchemaRequest
//         }
//       },
//       description: 'Create a new user'
//     }
//   },
//   responses: {
//     200: {
//       content: {
//         'application/json': {
//           schema: userSchemaResponse
//         }
//       },
//       description: 'User created'
//     },
//     400: {
//       content: {
//         'application/json': {
//           schema: userSchemaError
//         }
//       },
//       description: 'Invalid input'
//     }
//   }
// } as const

export const userPatchRoute = {
  method: 'patch',
  path: `${resource}/:id`,
  tags,
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
} as const

export const userGetRoute = {
  method: 'get',
  path: `${resource}/:id`,
  tags,
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
} as const

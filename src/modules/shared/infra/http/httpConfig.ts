import { rateLimiter } from 'hono-rate-limiter'

export const statusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
}

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    description: 'API Documentation for the project',
    version: '1.0.0',
    contact: {
      name: 'Alcir Junior [Caju]',
      email: 'junior@cajucomunica.com.br'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  }
}

export const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-6', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => '<unique_key>' // Method to generate custom identifiers for clients.
  // store: ... , // Redis, MemoryStore, etc. See below.
})

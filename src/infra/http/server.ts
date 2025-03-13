import { uploadImageRoute } from '@/infra/http/routes/upload-image'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.message,
    })
  }

  console.log(error)

  return reply.status(500).send({ message: 'Internal server Error' })
})

server.register(fastifyCors, { origin: '*' })

server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Server is running on port 3333')
})

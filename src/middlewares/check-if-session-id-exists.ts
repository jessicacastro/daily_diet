import { FastifyReply, FastifyRequest } from 'fastify'

export const checkIfSessionIdExists = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { sessionId } = request.cookies

  if (!sessionId)
    return reply.status(401).send({ error: 'Unauthorized request' })
}

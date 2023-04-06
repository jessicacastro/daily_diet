import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import { knex } from '../database'

import { checkIfUserExists } from '../middlewares/check-if-user-exists'
import { transformStringToDate } from '../utils/transform-string-to-date'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.get('/', { preHandler: [checkIfUserExists] }, async (request, reply) => {
    const { userId } = request.cookies

    const meals = await knex('meals').where({ userId })

    if (!meals) {
      return reply.status(400).send({ error: 'No meals found' })
    }

    return reply.status(200).send(meals)
  })

  app.get(
    '/:id',
    { preHandler: [checkIfUserExists] },
    async (request, reply) => {
      const getMealSchemaParams = z.object({
        id: z.string(),
      })

      const resultMealSchemaParams = getMealSchemaParams.safeParse(
        request.params,
      )

      if (!resultMealSchemaParams.success) {
        return reply.status(400).send({ error: 'Invalid request' })
      }

      const { userId } = request.cookies

      const { id } = resultMealSchemaParams.data

      const meal = await knex('meals').where({ id, userId })

      if (!meal) {
        return reply.status(400).send({ error: 'Meal not found' })
      }

      return reply.status(200).send(meal)
    },
  )

  app.post('/', { preHandler: [checkIfUserExists] }, async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string(),
      inDiet: z.boolean(),
    })

    const resultMealSchema = createMealSchema.safeParse(request.body)

    if (!resultMealSchema.success) {
      return reply.status(400).send({ error: 'Invalid request' })
    }

    const { name, description, datetime, inDiet } = resultMealSchema.data

    const { userId } = request.cookies

    const meal = {
      id: randomUUID(),
      name,
      description,
      datetime: transformStringToDate(datetime),
      userId,
      inDiet,
    }

    await knex('meals').insert(meal)

    return reply.status(201).send(meal)
  })

  app.put(
    '/:id',
    { preHandler: [checkIfUserExists] },
    async (request, reply) => {
      const updateMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        datetime: z.date(),
        inDiet: z.boolean(),
      })

      const updateMealSchemaParams = z.object({
        id: z.string(),
      })

      const resultMealSchema = updateMealSchema.safeParse(request.body)
      const resultMealSchemaParams = updateMealSchemaParams.safeParse(
        request.params,
      )

      if (!resultMealSchema.success || !resultMealSchemaParams.success) {
        return reply.status(400).send({ error: 'Invalid request' })
      }

      const { name, description, datetime, inDiet } = resultMealSchema.data

      const { userId } = request.cookies

      const { id } = resultMealSchemaParams.data

      const meal = await knex('meals').where({ id, userId })

      if (!meal) {
        return reply.status(400).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id, userId }).update({
        name,
        description,
        datetime,
        inDiet,
      })

      return reply.status(200).send(meal)
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkIfUserExists] },
    async (request, reply) => {
      const deleteMealSchema = z.object({
        id: z.string(),
      })

      const resultMealSchema = deleteMealSchema.safeParse(request.params)

      if (!resultMealSchema.success) {
        return reply.status(400).send({ error: 'Invalid request' })
      }

      const { userId } = request.cookies

      const { id } = resultMealSchema.data

      const meal = await knex('meals').where({ id, userId })

      if (!meal) {
        return reply.status(400).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id, userId }).del()

      return reply.status(201).send()
    },
  )
}

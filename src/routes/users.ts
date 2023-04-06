import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import { knex } from '../database'
import { checkIfUserExists } from '../middlewares/check-if-user-exists'
import { createUserPassword } from '../utils/create-user-password'
import { checkBestSequenceOfMeals } from '../utils/check-best-sequence-of-meals'

export const usersRoutes = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    const users = await knex('users')

    return reply.status(200).send(users)
  })

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      avatar: z.string().nullable(),
    })

    const resultUserSchema = createUserSchema.safeParse(request.body)

    if (!resultUserSchema.success) {
      return reply.status(400).send({ error: 'Invalid request' })
    }

    const {
      name,
      email,
      password: userPassword,
      avatar,
    } = resultUserSchema.data

    const userExists = await knex('users').where({ email }).first()

    if (userExists) {
      return reply.status(400).send({ error: 'User already exists' })
    }

    const password = createUserPassword(userPassword)

    const user = {
      id: randomUUID(),
      name,
      email,
      password,
      avatar: avatar || 'https://i.pravatar.cc/150?img=1',
    }

    reply.setCookie('userId', user.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    await knex('users').insert(user)

    return reply.status(201).send()
  })

  app.get(
    '/stats',
    { preHandler: checkIfUserExists },
    async (request, reply) => {
      const { userId } = request.cookies

      const meals = await knex('meals').where({ userId })

      const totalMeals = meals.length
      const mealsInDiet = meals
        .filter((meal) => meal.inDiet)
        .map((meal) => ({
          ...meal,
          datetime: new Date(meal.datetime).toISOString(),
        }))

      const mealsNotInDiet = meals.filter((meal) => !meal.inDiet)
      const bestSequenceOfDaysInDiet = checkBestSequenceOfMeals(mealsInDiet)

      return reply.status(200).send({
        totalMeals,
        mealsInDiet: mealsInDiet.length,
        mealsNotInDiet: mealsNotInDiet.length,
        bestSequence: bestSequenceOfDaysInDiet.length,
      })
    },
  )
}

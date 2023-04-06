import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, { prefix: '/users' })
app.register(mealsRoutes, { prefix: '/meals' })

app.get('/isUp', async () => {
  return {
    message: 'Server is up! Start coding and thanks for use this API! 🍾',
  }
})

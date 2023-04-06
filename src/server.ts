import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.PORT,
  })
  .then(() =>
    console.log(`Server is running! You can access /isUp to check! 🚀`),
  )
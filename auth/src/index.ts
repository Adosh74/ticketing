import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'


import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFound } from './errors/not-found-error'
import { healthCheckRouter } from './routes/health-check'

const app = express()
app.use(json())

app.use(healthCheckRouter)
app.use(currentUserRouter) 
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
    throw new NotFound()
})

app.use(errorHandler)

app.listen(3000, () => {
    console.log('Auth service listening on port 3000!!!!')
})
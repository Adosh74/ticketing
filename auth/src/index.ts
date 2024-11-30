import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFound } from './errors/not-found-error'
import { healthCheckRouter } from './routes/health-check'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: true
}))

app.use(healthCheckRouter)
app.use(currentUserRouter) 
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
    throw new NotFound()
})

app.use(errorHandler)


const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017')
        console.log('Connected to auth mongo db');
    } catch (err) {
        console.error(err)
    }
    app.listen(3000, () => {
        console.log('Auth service listening on port 3000!!!!')
    })
}

start()
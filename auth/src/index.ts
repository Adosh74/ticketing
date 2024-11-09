import express, {Request, Response} from 'express'
import {json } from 'body-parser'

const app = express()
app.use(json())

app.get('/api/users/currentUser', (req: Request, res: Response) =>{
    res.send('Hi there!')
}) 

app.listen(3000, () => {
    console.log('Auth service listening on port 3000!!!!')
})
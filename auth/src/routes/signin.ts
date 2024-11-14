import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

const router = Router();

router.post('/api/users/signin', (_req: Request, res: Response) =>{
    res.send('Hi there!')
})

export{ router as signinRouter }
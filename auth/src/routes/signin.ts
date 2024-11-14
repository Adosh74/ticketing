import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

const router = Router();

router.post('/api/users/signin',  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters')

],
(_req: Request, res: Response) =>{
    res.send('Hi there!')
})

export{ router as signinRouter }
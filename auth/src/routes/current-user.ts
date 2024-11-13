import { Router, Request, Response } from 'express';

const router = Router();

router.get('/api/users/currentUser', (_req: Request, res: Response) =>{
    res.send('Hi there!')
})

export{ router as currentUserRouter }
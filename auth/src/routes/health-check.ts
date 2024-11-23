import { Router, Request, Response, NextFunction } from "express";
import { NotFound } from "../errors/not-found-error";

const router = Router();

router.get('/api/users/healthz', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
})

export {router as healthCheckRouter}
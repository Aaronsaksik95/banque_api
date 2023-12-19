import { Router } from 'express';
const router = Router();

import userRouter from './users.route.js';
import accountRouter from './accounts.route.js';
import operationRouter from './operations.route.js';

router.use('/users/', userRouter);
router.use('/accounts/', accountRouter);
router.use('/operations/', operationRouter);

export default router;
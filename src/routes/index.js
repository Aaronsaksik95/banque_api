import userRouter from './users.route.js';
import accountRouter from './accounts.route.js';
import operationRouter from './operations.route.js';

import { Router } from 'express';

const router = Router();

router.use('/users/', userRouter);
router.use('/accounts/', accountRouter);
router.use('/operations/', operationRouter);

export default router;
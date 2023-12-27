import verifyToken from '../middlewares/verifyToken.js'
import { getAllOperation} from '../controllers/operations.controller.js';

import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, getAllOperation);

export default router;
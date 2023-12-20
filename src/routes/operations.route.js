import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js'
import { getAllOperation, getOperationId, createOperation, updateOperation, deleteOperation } from '../controllers/operations.controller.js';

const router = Router();

router.get('/', verifyToken, getAllOperation);

export default router;
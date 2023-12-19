import { Router } from 'express';
const router = Router();

import { getAllOperation, getOperationId, createOperation, updateOperation, deleteOperation } from '../controllers/operations.controller.js';

router.get('/', getAllOperation);
router.get('/:id', getOperationId);
router.post('/', createOperation);
router.put('/:id', updateOperation);
router.delete('/:id', deleteOperation);


export default router;
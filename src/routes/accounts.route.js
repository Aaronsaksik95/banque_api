import { Router } from 'express';
const router = Router();

import { getAllAccount, getAccountId, createAccount, updateAccount, deleteAccount } from '../controllers/accounts.controller.js';

router.get('/', getAllAccount);
router.get('/:id', getAccountId);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);


export default router;
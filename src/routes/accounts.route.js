import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js'
import { getAllAccount, getAccountId, createAccount, updateAccount, deleteAccount } from '../controllers/accounts.controller.js';
const router = Router();

router.get('/', verifyToken, getAllAccount);
router.get('/:id', verifyToken, getAccountId);
router.post('/', verifyToken, createAccount);
router.put('/:id', verifyToken, updateAccount);
router.delete('/:id', verifyToken, deleteAccount);


export default router;
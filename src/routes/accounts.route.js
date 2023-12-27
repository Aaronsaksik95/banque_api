import verifyToken from '../middlewares/verifyToken.js'
import {
    getAllAccount,
    getAccountId,
    createAccount,
    depositIntoAccount,
    withdrawalIntoAccount,
    transferAccount
} from '../controllers/accounts.controller.js';

import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, getAllAccount);
router.get('/:id', verifyToken, getAccountId);
router.post('/', verifyToken, createAccount);
router.patch('/:id/deposit', verifyToken, depositIntoAccount);
router.patch('/:id/withdraw', verifyToken, withdrawalIntoAccount);
router.patch('/:id/transfer', verifyToken, transferAccount);


export default router;
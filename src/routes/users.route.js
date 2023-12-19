import { Router } from 'express';
const router = Router();
import { getAllUser, getUserId, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';

router.get('/', getAllUser);
router.get('/:id', getUserId);
router.post('/', createUser);
router.put('/', updateUser);
router.delete('/', deleteUser);


export default router;
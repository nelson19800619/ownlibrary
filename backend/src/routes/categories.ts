import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), createCategory);
router.put('/:id', authenticate, authorize('ADMIN', 'LIBRARIAN'), updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

export default router;

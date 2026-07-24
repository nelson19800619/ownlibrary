import { Router } from 'express';
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articles.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getArticles);
router.get('/:id', authenticate, getArticle);
router.post('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), createArticle);
router.put('/:id', authenticate, authorize('ADMIN', 'LIBRARIAN'), updateArticle);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteArticle);

export default router;

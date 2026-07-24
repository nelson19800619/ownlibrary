import { Router } from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/books.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBooks);
router.get('/:id', authenticate, getBook);
router.post('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), createBook);
router.put('/:id', authenticate, authorize('ADMIN', 'LIBRARIAN'), updateBook);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteBook);

export default router;

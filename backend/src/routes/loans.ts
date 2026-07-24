import { Router } from 'express';
import { getLoans, getLoan, createLoan, returnLoan } from '../controllers/loans.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), getLoans);
router.get('/:id', authenticate, authorize('ADMIN', 'LIBRARIAN'), getLoan);
router.post('/', authenticate, createLoan);
router.put('/:id/return', authenticate, authorize('ADMIN', 'LIBRARIAN'), returnLoan);

export default router;

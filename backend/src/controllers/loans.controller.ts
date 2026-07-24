import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getLoans = async (req: Request, res: Response): Promise<void> => {
  const { status, userId, page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = {
    ...(status && { status: status as 'ACTIVE' | 'RETURNED' | 'OVERDUE' }),
    ...(userId && { userId }),
  };
  const [loans, total] = await Promise.all([
    prisma.loan.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true, author: true } },
      },
      orderBy: { loanedAt: 'desc' },
    }),
    prisma.loan.count({ where }),
  ]);
  res.json({ data: loans, total, page: parseInt(page), limit: parseInt(limit) });
};

export const getLoan = async (req: Request, res: Response): Promise<void> => {
  const loan = await prisma.loan.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      book: { select: { id: true, title: true, author: true, isbn: true } },
    },
  });
  if (!loan) {
    res.status(404).json({ message: 'Loan not found' });
    return;
  }
  res.json(loan);
};

export const createLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const { bookId, dueDate, userId } = req.body;
  if (!bookId || !dueDate) {
    res.status(400).json({ message: 'bookId and dueDate are required' });
    return;
  }
  const targetUserId = userId ?? req.user!.id;
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  if (book.available < 1) {
    res.status(409).json({ message: 'No copies available for loan' });
    return;
  }
  const [loan] = await prisma.$transaction([
    prisma.loan.create({
      data: { userId: targetUserId, bookId, dueDate: new Date(dueDate), status: 'ACTIVE' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true, author: true } },
      },
    }),
    prisma.book.update({ where: { id: bookId }, data: { available: { decrement: 1 } } }),
  ]);
  res.status(201).json(loan);
};

export const returnLoan = async (req: Request, res: Response): Promise<void> => {
  const loan = await prisma.loan.findUnique({ where: { id: req.params.id } });
  if (!loan) {
    res.status(404).json({ message: 'Loan not found' });
    return;
  }
  if (loan.status === 'RETURNED') {
    res.status(409).json({ message: 'Loan already returned' });
    return;
  }
  const [updated] = await prisma.$transaction([
    prisma.loan.update({
      where: { id: req.params.id },
      data: { status: 'RETURNED', returnedAt: new Date() },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true, author: true } },
      },
    }),
    prisma.book.update({ where: { id: loan.bookId }, data: { available: { increment: 1 } } }),
  ]);
  res.json(updated);
};

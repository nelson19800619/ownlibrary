import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  const { search, categoryId, page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { author: { contains: search, mode: 'insensitive' as const } },
        { isbn: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
  };
  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.book.count({ where }),
  ]);
  res.json({ data: books, total, page: parseInt(page), limit: parseInt(limit) });
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  const book = await prisma.book.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  const { title, author, isbn, description, quantity, publishedAt, categoryId } = req.body;
  if (!title || !author) {
    res.status(400).json({ message: 'title and author are required' });
    return;
  }
  const book = await prisma.book.create({
    data: {
      title,
      author,
      isbn,
      description,
      quantity: quantity ?? 1,
      available: quantity ?? 1,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      categoryId,
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.status(201).json(book);
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  const { title, author, isbn, description, quantity, available, publishedAt, categoryId } = req.body;
  const book = await prisma.book.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(author && { author }),
      ...(isbn !== undefined && { isbn }),
      ...(description !== undefined && { description }),
      ...(quantity !== undefined && { quantity }),
      ...(available !== undefined && { available }),
      ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      ...(categoryId !== undefined && { categoryId }),
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.json(book);
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  await prisma.book.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

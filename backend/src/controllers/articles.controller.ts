import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  const { search, categoryId, page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { author: { contains: search, mode: 'insensitive' as const } },
        { journal: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
  };
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.article.count({ where }),
  ]);
  res.json({ data: articles, total, page: parseInt(page), limit: parseInt(limit) });
};

export const getArticle = async (req: Request, res: Response): Promise<void> => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json(article);
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const { title, author, journal, doi, description, publishedAt, categoryId } = req.body;
  if (!title || !author) {
    res.status(400).json({ message: 'title and author are required' });
    return;
  }
  const article = await prisma.article.create({
    data: {
      title,
      author,
      journal,
      doi,
      description,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      categoryId,
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.status(201).json(article);
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  const { title, author, journal, doi, description, publishedAt, categoryId } = req.body;
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(author && { author }),
      ...(journal !== undefined && { journal }),
      ...(doi !== undefined && { doi }),
      ...(description !== undefined && { description }),
      ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      ...(categoryId !== undefined && { categoryId }),
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.json(article);
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  await prisma.article.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

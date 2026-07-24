import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'name is required' });
    return;
  }
  const category = await prisma.category.create({ data: { name } });
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name },
  });
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

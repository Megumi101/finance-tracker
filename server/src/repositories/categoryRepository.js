// src/repositories/categoryRepository.js
import prisma from '../config/prisma.js'

export const findAllCategories = async (userId) => {
  return prisma.category.findMany({
    where: { userId },
    include: {
      transactions: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const findCategoryById = async (id, userId) => {
  return prisma.category.findUnique({
    where: { id },
    include: { transactions: true },
  })
}

export const createCategory = async (userId, { name, color, icon }) => {
  return prisma.category.create({
    data: {
      name,
      color,
      icon,
      userId,
    },
    include: { transactions: true },
  })
}

export const updateCategory = async (id, userId, { name, color, icon }) => {
  // Validate that category belongs to this user
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  })
  
  if (!existingCategory) {
    throw new Error('Kategori tidak ditemukan')
  }
  
  if (existingCategory.userId !== userId) {
    throw new Error('Kategori tidak milik user ini')
  }

  return prisma.category.update({
    where: { id },
    data: {
      name,
      color,
      icon,
    },
    include: { transactions: true },
  })
}

export const deleteCategory = async (id, userId) => {
  // Validate that category belongs to this user
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  })
  
  if (!existingCategory) {
    throw new Error('Kategori tidak ditemukan')
  }
  
  if (existingCategory.userId !== userId) {
    throw new Error('Kategori tidak milik user ini')
  }

  return prisma.category.delete({
    where: { id },
    include: { transactions: true },
  })
}

export const getCategoryStats = async (userId) => {
  const categories = await prisma.category.findMany({
		where: { userId },
		include: {
			transactions: {
				select: {
					id: true,
					amount: true,
					type: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	// Ensure each category has default color if not set
	return categories.map((cat) => ({
		...cat,
		color: cat.color || "#8B5CF6", // Purple as default
	}));
}

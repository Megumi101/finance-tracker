// src/repositories/transactionRepository.js
import prisma from '../config/prisma.js'

export const findAllTransactions = async (userId) => {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  })
}

export const findTransactionById = async (id, userId) => {
  return prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  })
}

export const createTransaction = async (userId, { amount, type, description, date, categoryId }) => {
  return prisma.transaction.create({
    data: {
      amount,
      type,
      description,
      date: date ? new Date(date) : new Date(),
      userId,
      categoryId: categoryId || null,
    },
    include: { category: true },
  })
}

export const updateTransaction = async (id, userId, { amount, type, description, date, categoryId }) => {
  // Validate that transaction belongs to this user
  const existingTransaction = await prisma.transaction.findUnique({
    where: { id },
  })
  
  if (!existingTransaction) {
    throw new Error('Transaksi tidak ditemukan')
  }
  
  if (existingTransaction.userId !== userId) {
    throw new Error('Transaksi tidak milik user ini')
  }

  return prisma.transaction.update({
    where: { id },
    data: {
      amount,
      type,
      description,
      date: date ? new Date(date) : undefined,
      categoryId: categoryId || null,
    },
    include: { category: true },
  })
}

export const deleteTransaction = async (id, userId) => {
  // Validate that transaction belongs to this user
  const existingTransaction = await prisma.transaction.findUnique({
    where: { id },
  })
  
  if (!existingTransaction) {
    throw new Error('Transaksi tidak ditemukan')
  }
  
  if (existingTransaction.userId !== userId) {
    throw new Error('Transaksi tidak milik user ini')
  }

  return prisma.transaction.delete({
    where: { id },
  })
}

export const getTransactionsByMonth = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  return prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  })
}

export const getTransactionsByCategory = async (userId, categoryId) => {
  return prisma.transaction.findMany({
    where: { userId, categoryId },
    include: { category: true },
    orderBy: { date: 'desc' },
  })
}

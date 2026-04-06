// src/repositories/auth.repository.js
import prisma from '../config/prisma.js'

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } })
}

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  })
}

export const createUser = async ({ name, email, password }) => {
  return prisma.user.create({
    data: { name, email, password },
    select: { id: true, name: true, email: true, createdAt: true },
  })
}
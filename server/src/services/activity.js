import { prisma } from "../prisma.js";

export async function logActivity({ type, message, donorId, requestId }) {
  return prisma.activity.create({
    data: { type, message, donorId, requestId }
  });
}

export async function nextToken(prisma, prefix, model) {
  const latest = await prisma[model].findFirst({
    where: { token: { startsWith: prefix } },
    orderBy: { id: "desc" },
    select: { token: true }
  });
  const n = latest ? Number(latest.token.replace(/\D/g, "")) + 1 : 1001;
  return `${prefix}${n}`;
}

import { prisma } from "../prisma.js";

export async function getStats(req, res, next) {
  try {
    const [totalDonors, availableNow, openRequests] = await Promise.all([
      prisma.donor.count(),
      prisma.donor.count({ where: { status: "AVAILABLE" } }),
      prisma.bloodRequest.count({ where: { status: { in: ["OPEN", "MATCHED"] } } })
    ]);
    res.json({ totalDonors, availableNow, openRequests });
  } catch (e) { next(e); }
}

export async function getActivity(req, res, next) {
  try {
    const activity = await prisma.activity.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
    res.json(activity);
  } catch (e) { next(e); }
}

import { prisma } from "../prisma.js";
import { bloodLabel, donorCanGive, locationScore } from "../utils/blood.js";

export async function findMatches(request) {
  const donors = await prisma.donor.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" }
  });

  const candidates = donors
    .filter(d => donorCanGive(d.bloodGroup, bloodLabel(request.bloodGroup)))
    .map(d => ({
      donor: d,
      locationScore: locationScore(d.location, request.location),
      exactBlood: bloodLabel(d.bloodGroup) === bloodLabel(request.bloodGroup)
    }))
    .sort((a,b) =>
      b.locationScore - a.locationScore ||
      Number(b.exactBlood) - Number(a.exactBlood) ||
      b.donor.donationCount - a.donor.donationCount
    );

  return candidates;
}

export async function persistMatches(request, candidates) {
  for (const item of candidates) {
    await prisma.match.upsert({
      where: { donorId_requestId: { donorId: item.donor.id, requestId: request.id } },
      update: { matchType: item.locationScore > 0 ? "COMPATIBLE + LOCATION" : "COMPATIBLE", status: "PENDING" },
      create: {
        donorId: item.donor.id,
        requestId: request.id,
        matchType: item.locationScore > 0 ? "COMPATIBLE + LOCATION" : "COMPATIBLE",
        status: "PENDING"
      }
    });
  }
}

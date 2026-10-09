import { prisma } from "../prisma.js";
import { z } from "zod";
import { bloodDb, bloodLabel } from "../utils/blood.js";
import { maskPhone } from "../utils/phone.js";
import { nextToken } from "../utils/token.js";
import { logActivity } from "../services/activity.js";
import { findMatches, persistMatches } from "../services/matching.js";

const requestSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/),
  bloodGroup: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]),
  location: z.string().trim().min(2).max(100),
  unitsNeeded: z.coerce.number().int().min(1).max(20)
});

export async function createRequest(req, res, next) {
  try {
    const data = requestSchema.parse(req.body);
    const token = await nextToken(prisma, "BR", "bloodRequest");
    const request = await prisma.bloodRequest.create({
      data: { ...data, bloodGroup: bloodDb(data.bloodGroup), token }
    });

    const candidates = await findMatches(request);
    await persistMatches(request, candidates);

    if (candidates.length) {
      await prisma.bloodRequest.update({ where: { id: request.id }, data: { status: "MATCHED" } });
    }

    await logActivity({
      type: "REQUEST_CREATED",
      requestId: request.id,
      message: `Blood request ${token} created for ${data.bloodGroup} in ${data.location}.`
    });

    res.status(201).json({
      success: true,
      request: { ...request, bloodGroup: data.bloodGroup, contactPhone: maskPhone(request.contactPhone), status: candidates.length ? "MATCHED" : "OPEN" },
      matches: candidates.map(x => ({ ...x.donor, bloodGroup: bloodLabel(x.donor.bloodGroup), phone: maskPhone(x.donor.phone), locationScore: x.locationScore }))
    });
  } catch (e) { next(e); }
}

export async function listRequests(req, res, next) {
  try {
    const requests = await prisma.bloodRequest.findMany({ orderBy: { createdAt: "desc" } });
    res.json(requests.map(r => ({ ...r, bloodGroup: bloodLabel(r.bloodGroup), contactPhone: maskPhone(r.contactPhone) })));
  } catch (e) { next(e); }
}

export async function getRequest(req, res, next) {
  try {
    const request = await prisma.bloodRequest.findUnique({ where: { token: req.params.token } });
    if (!request) return res.status(404).json({ error: "Request token not found." });
    const matches = await prisma.match.findMany({
      where: { requestId: request.id },
      include: { donor: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({
      request: { ...request, bloodGroup: bloodLabel(request.bloodGroup), contactPhone: maskPhone(request.contactPhone) },
      matches: matches.map(m => ({ ...m, donor: { ...m.donor, bloodGroup: bloodLabel(m.donor.bloodGroup), phone: maskPhone(m.donor.phone) } }))
    });
  } catch (e) { next(e); }
}

export async function requestMatches(req, res, next) {
  try {
    const request = await prisma.bloodRequest.findUnique({ where: { token: req.params.token } });
    if (!request) return res.status(404).json({ error: "Request token not found." });
    const candidates = await findMatches(request);
    res.json(candidates.map(x => ({ ...x.donor, bloodGroup: bloodLabel(x.donor.bloodGroup), phone: maskPhone(x.donor.phone), locationScore: x.locationScore })));
  } catch (e) { next(e); }
}

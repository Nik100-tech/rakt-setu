import { prisma } from "../prisma.js";
import { z } from "zod";
import { isValidIndianPhone, maskPhone } from "../utils/phone.js";
import { bloodDb, bloodLabel } from "../utils/blood.js";
import { nextToken } from "../utils/token.js";
import { logActivity } from "../services/activity.js";
import { findMatches } from "../services/matching.js";
import QRCode from "qrcode";

const donorSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  bloodGroup: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]),
  location: z.string().trim().min(2).max(100)
});

export async function createDonor(req, res, next) {
  try {
    const data = donorSchema.parse(req.body);
    if (!isValidIndianPhone(data.phone)) return res.status(400).json({ error: "Invalid Indian phone number." });
    const exists = await prisma.donor.findUnique({ where: { phone: data.phone } });
    if (exists) return res.status(409).json({ error: "This phone number is already registered.", token: exists.token });

    const token = await nextToken(prisma, "BD", "donor");
    const donor = await prisma.donor.create({
      data: { ...data, bloodGroup: bloodDb(data.bloodGroup), token }
    });

    await logActivity({
      type: "DONOR_REGISTERED",
      donorId: donor.id,
      message: `SMS to ${donor.token}: Registered as ${data.bloodGroup} donor in ${data.location}.`
    });

    res.status(201).json({ success: true, donor: { ...donor, bloodGroup: data.bloodGroup, phone: maskPhone(donor.phone) } });
  } catch (e) { next(e); }
}

export async function listDonors(req, res, next) {
  try {
    const donors = await prisma.donor.findMany({ orderBy: { createdAt: "desc" } });
    res.json(donors.map(d => ({ ...d, bloodGroup: bloodLabel(d.bloodGroup), phone: maskPhone(d.phone) })));
  } catch (e) { next(e); }
}

export async function getDonor(req, res, next) {
  try {
    const donor = await prisma.donor.findUnique({ where: { token: req.params.token } });
    if (!donor) return res.status(404).json({ error: "Token not found." });
    const matches = await prisma.match.findMany({
      where: { donorId: donor.id },
      include: { request: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({
      donor: { ...donor, bloodGroup: bloodLabel(donor.bloodGroup), phone: maskPhone(donor.phone) },
      matches: matches.map(m => ({
        ...m,
        request: { ...m.request, bloodGroup: bloodLabel(m.request.bloodGroup), contactPhone: maskPhone(m.request.contactPhone) }
      }))
    });
  } catch (e) { next(e); }
}

export async function updateDonorStatus(req, res, next) {
  try {
    const status = z.enum(["AVAILABLE","UNAVAILABLE"]).parse(req.body.status);
    const donor = await prisma.donor.update({ where: { token: req.params.token }, data: { status } });
    res.json({ success: true, status: donor.status });
  } catch (e) { next(e); }
}

export async function donorMatches(req, res, next) {
  try {
    const donor = await prisma.donor.findUnique({ where: { token: req.params.token } });
    if (!donor) return res.status(404).json({ error: "Token not found." });
    const candidates = await findMatches({ bloodGroup: donor.bloodGroup, location: donor.location });
    res.json(candidates.map(x => ({ ...x.donor, bloodGroup: bloodLabel(x.donor.bloodGroup), phone: maskPhone(x.donor.phone), locationScore: x.locationScore })));
  } catch (e) { next(e); }
}

export async function donorIdCard(req, res, next) {
  try {
    const donor = await prisma.donor.findUnique({ where: { token: req.params.token } });
    if (!donor) return res.status(404).json({ error: "Token not found." });
    const label = bloodLabel(donor.bloodGroup);
    const qr = await QRCode.toDataURL(`RAKT-SETU:${donor.token}`, { margin: 1, width: 180 });
    const safe = (v) => String(v).replace(/[<>&"]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520">
      <rect width="900" height="520" rx="30" fill="#fff7f7"/>
      <rect x="0" y="0" width="900" height="105" rx="30" fill="#b91c1c"/>
      <text x="55" y="67" font-family="Arial" font-size="40" font-weight="700" fill="white">RAKT SETU</text>
      <text x="55" y="145" font-family="Arial" font-size="22" fill="#7f1d1d">DONOR IDENTIFICATION CARD</text>
      <text x="55" y="215" font-family="Arial" font-size="18" fill="#6b7280">DONOR NAME</text>
      <text x="55" y="250" font-family="Arial" font-size="30" font-weight="700" fill="#111827">${safe(donor.fullName)}</text>
      <text x="55" y="305" font-family="Arial" font-size="18" fill="#6b7280">BLOOD GROUP</text>
      <text x="55" y="345" font-family="Arial" font-size="42" font-weight="700" fill="#b91c1c">${label}</text>
      <text x="260" y="305" font-family="Arial" font-size="18" fill="#6b7280">TOKEN</text>
      <text x="260" y="345" font-family="Arial" font-size="30" font-weight="700" fill="#111827">${safe(donor.token)}</text>
      <text x="55" y="405" font-family="Arial" font-size="18" fill="#6b7280">LOCATION</text>
      <text x="55" y="440" font-family="Arial" font-size="24" fill="#111827">${safe(donor.location)}</text>
      <image href="${qr}" x="680" y="160" width="180" height="180"/>
      <text x="670" y="370" font-family="Arial" font-size="15" fill="#6b7280">SCAN TOKEN</text>
    </svg>`;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Content-Disposition", `attachment; filename="${donor.token}-id-card.svg"`);
    res.send(svg);
  } catch (e) { next(e); }
}

import { Router } from "express";
import { createDonor, listDonors, getDonor, updateDonorStatus, donorMatches, donorIdCard } from "../controllers/donors.js";

const router = Router();
router.post("/", createDonor);
router.get("/", listDonors);
router.get("/:token/matches", donorMatches);
router.get("/:token/id-card", donorIdCard);
router.patch("/:token/status", updateDonorStatus);
router.get("/:token", getDonor);
export default router;

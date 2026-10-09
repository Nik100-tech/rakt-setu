import { Router } from "express";
import { getActivity } from "../controllers/stats.js";
const router = Router();
router.get("/", getActivity);
export default router;

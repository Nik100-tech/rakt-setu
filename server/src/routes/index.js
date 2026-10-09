import { Router } from "express";
import donorRoutes from "./donors.js";
import requestRoutes from "./requests.js";
import statsRoutes from "./stats.js";
import activityRoutes from "./activity.js";

const router = Router();
router.use("/donors", donorRoutes);
router.use("/requests", requestRoutes);
router.use("/stats", statsRoutes);
router.use("/activity", activityRoutes);
router.get("/health", (req,res) => res.json({ status: "ok" }));
export default router;

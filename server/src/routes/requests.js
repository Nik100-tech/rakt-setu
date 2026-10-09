import { Router } from "express";
import { createRequest, listRequests, getRequest, requestMatches } from "../controllers/requests.js";

const router = Router();
router.post("/", createRequest);
router.get("/", listRequests);
router.get("/:token/matches", requestMatches);
router.get("/:token", getRequest);
export default router;

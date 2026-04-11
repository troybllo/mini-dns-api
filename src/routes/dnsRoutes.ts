import { Router } from "express";
import {
  addRecord,
  getRecords,
  resolveHostname,
  deleteRecord,
} from "../controllers/dnsController.js";

const router = Router();

router.post("/dns", addRecord);
router.get("/dns/:hostname", resolveHostname);
router.get("/dns/:hostname/records", getRecords);
router.delete("/dns/:hostname", deleteRecord);

export default router;


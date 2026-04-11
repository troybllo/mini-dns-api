import type { Request, Response } from "express";
import { addDNSRecord, getRecordsByHostname } from "../services/dnsService.js";
import { DNSError } from "../utils/errors.js";

export function addRecord(req: Request, res: Response) {
  try {
    const { hostname, type, value } = req.body;
    if (!hostname || !type || !value) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const result = addDNSRecord(hostname, type, value);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof DNSError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export function resolveHostname(req: Request, res: Response) {}

export function getRecords(req: Request, res: Response) {
  try {
    if (!req.params.hostname) {
      return res.status(400).json({
        error: "Missing hostname",
      });
    }

    const result = getRecordsByHostname(req.params.hostname.toString());
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof DNSError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export function deleteRecord(req: Request, res: Response) {}

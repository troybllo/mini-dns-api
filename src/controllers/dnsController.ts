import type { Request, Response } from "express";
import {
  addDNSRecord,
  deleteRecordByHostname,
  getRecordsByHostname,
  resolveHostname,
} from "../services/dnsService.js";
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

export function resolvehostname(req: Request, res: Response) {
  try {
    if (!req.params.hostname) {
      return res.status(404).json({ error: "Missing hostname" });
    }

    const result = resolveHostname(req.params.hostname.toString());
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof DNSError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

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

export function deleteRecord(req: Request, res: Response) {
  try {
    const hostname = req.params.hostname as string;
    const type = req.query.type as "A" | "CNAME";
    const value = req.query.value as string;

    if (!hostname || !type || !value) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const result = deleteRecordByHostname(hostname, type, value);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof DNSError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

import { isValidHostname, isValidIPAddress } from "../utils/validators.js";
import type { DNS } from "../models/types.js";
import { records } from "../models/store.js";
import { DNSError } from "../utils/errors.js";

export function addDNSRecord(
  hostname: string,
  type: "A" | "CNAME",
  value: string,
) {
  // Calls your validators to check inputs
  const record: DNS = { hostname: hostname, type: type, value: value };

  if (!isValidHostname(hostname)) throw new DNSError(400, "Invalid hostname");

  if (type === "A" && !isValidIPAddress(value))
    throw new DNSError(400, "A type does not have a valid IP Address");

  if (type === "CNAME" && !isValidHostname(value))
    throw new DNSError(400, "CNAME does not have a valid Hostname");

  // Checks if a duplicate record already exists
  const existing = records.get(hostname) ?? [];
  const isDuplicate = existing.some(
    (r) => r.type == record.type && r.value === record.value,
  );

  // Checks the CNAME conlict rules(rememebr: CNAME cant coexist with any other records and one CNAME per hostname)
  if (type === "CNAME" && existing.length > 0)
    throw new DNSError(403, "CNAME cannot coexist with other records");
  if (existing.some((r) => r.type === "CNAME"))
    throw new DNSError(403, "CNAME cannot coexist with other records");

  if (isDuplicate) {
    throw new DNSError(409, "Duplicate record found");
  } else {
    existing.push(record);
    records.set(hostname, existing);
    return { "Succesfully added record": record };
  }
}

export function getRecordsByHostname(hostname: string): DNS[] {
  if (!isValidHostname(hostname)) throw new DNSError(400, "Invalid hostname");

  const result = records.get(hostname);

  if (!result) throw new DNSError(404, "No records with this hostname");

  return result;
}

export function deleteRecordByHostname() {}

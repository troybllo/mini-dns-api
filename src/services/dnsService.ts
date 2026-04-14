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

export function deleteRecordByHostname(
  hostname: string,
  type: "A" | "CNAME",
  value: string,
) {
  if (!isValidHostname(hostname)) throw new DNSError(400, "Invalid hostname");
  if (type === "A" && !isValidIPAddress(value))
    throw new DNSError(400, "A type does not have a valid IP Address");
  if (type === "CNAME" && !isValidHostname(value))
    throw new DNSError(400, "CNAME does not have a valid Hostname");

  const existing = records.get(hostname);

  if (!existing)
    throw new DNSError(404, "No record with this hostname has been found");

  const match = existing.find((r) => r.type === type && r.value === value);
  if (!match) {
    throw new DNSError(404, "No matching record found");
  }

  const updated = existing.filter(
    (r) => !(r.type === type && r.value === value),
  );

  if (updated.length === 0) {
    records.delete(hostname);
  } else {
    records.set(hostname, updated);
  }

  return { "Succesfully deleted record": match };
}

export function resolveHostname(hostname: string): string[] {
  // validate hostname
  // create something to track visisted hostnames
  // loop: look up current hostname
  //   if A records -> return IPs
  //   if CNAME -> update current hostname, check for cycle
  //   if nothing -> broken chain
  //
  if (!isValidHostname(hostname)) throw new DNSError(400, "Invalid hostname");
  const visited = new Set<string>();
  let curr = hostname;

  while (true) {
    if (visited.has(curr)) throw new DNSError(500, "CNAME cycle detected");
    visited.add(curr);

    const existing = records.get(curr);

    if (!existing) throw new DNSError(404, "Broken chain - no records found");

    const aRecords = existing.filter((r) => r.type === "A");
    if (aRecords.length > 0) {
      return aRecords.map((r) => r.value);
    }

    const cname = existing.find((r) => r.type === "CNAME");
    if (cname) {
      curr = cname.value;
      continue;
    }
    throw new DNSError(404, "Broken chain - no A or CNAME records");
  }
}

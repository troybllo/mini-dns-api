const labelRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;

export function isValidHostname(hostname: string): boolean {
  if (hostname.length > 253) return false;

  const labels = hostname.split(".");
  return labels.every((label) => labelRegex.test(label) && label.length <= 63);
}

export function isValidIPAddress(IPv4: string): boolean {
  const octets = IPv4.split(".");
  if (octets.length !== 4) return false;

  return octets.every((octet) => {
    if (!/^\d+$/.test(octet)) return false;
    const num = Number(octet);
    if (num < 0 || num > 255) return false;
    if (octet !== String(num)) return false;
    return true;
  });
}

export type DNS = {
  hostname: string;
  type: "A" | "CNAME";
  value: string;
  ttl?: number;
};

export type DNSStore = Map<string, DNS[]>;

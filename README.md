# mini-dns-api

A lightweight in-memory DNS record management API built with Express and TypeScript.

## Setup

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3000`.

## Endpoints

All routes are prefixed with `/api`.

### Add a record

```
POST /api/dns
```

Body:
```json
{
  "hostname": "example.com",
  "type": "A",
  "value": "192.168.1.1"
}
```

- `type` must be `"A"` or `"CNAME"`
- CNAME records cannot coexist with other records for the same hostname
- Duplicate records are rejected (409)

### Resolve a hostname

```
GET /api/dns/:hostname
```

Follows the CNAME chain until it reaches A records and returns the resolved IPs. Detects cycles.

### Get records by hostname

```
GET /api/dns/:hostname/records
```

Returns all DNS records for the given hostname.

### Delete a record

```
DELETE /api/dns/:hostname
```

Body:
```json
{
  "type": "A",
  "value": "192.168.1.1"
}
```

Deletes the specific matching record. If no records remain for the hostname, the entry is removed entirely.

## Health check

```
GET /health
```

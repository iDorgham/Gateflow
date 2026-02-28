# MCP Server Setup (Prisma, GitHub, PostgreSQL)

This guide configures MCP servers for Cursor to improve development with Prisma, GitHub, and PostgreSQL.

---

## Quick setup

1. Copy the example config:
   ```bash
   cp mcp.json.example .cursor/mcp.json
   ```

2. Edit `.cursor/mcp.json` and replace placeholders:
   - `YOUR_GITHUB_PAT` → your [GitHub Personal Access Token](https://github.com/settings/tokens/new)
   - `YOUR_DATABASE_URL` → your PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/gateflow`)

3. Restart Cursor (or reload window) so MCP servers load.

---

## Config reference

### Prisma MCP (local)

Uses your local Prisma schema and migrations. Runs `prisma mcp` from `packages/db`.

```json
"Prisma-Local": {
  "command": "npx",
  "args": ["-y", "prisma", "mcp"],
  "cwd": "packages/db"
}
```

**Tools:** Prisma Studio, migrate-dev, migrate-status, migrate-reset, Create-Prisma-Postgres-Database, Prisma-Login

**Notes:**
- Ensure `packages/db/.env` or root `.env` has `DATABASE_URL`
- Remote Prisma MCP (`url: "https://mcp.prisma.io/mcp"`) needs Prisma Console auth for hosted Prisma Postgres

---

### GitHub MCP (local Docker)

Runs via Docker. Requires Docker installed and running.

```json
"github": {
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e",
    "GITHUB_PERSONAL_ACCESS_TOKEN",
    "ghcr.io/github/github-mcp-server"
  ],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx..."
  }
}
```

**PAT scopes:** `repo`, `read:org` (and `workflow` if using Actions)

**Alternative — remote GitHub MCP (no Docker):**
```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_PAT"
  }
}
```
Requires Cursor with remote MCP support. OAuth may be available depending on Cursor version.

---

### PostgreSQL MCP

Read-only schema inspection and SQL queries. Uses `@modelcontextprotocol/server-postgres`.

```json
"postgres": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-postgres",
    "postgresql://user:password@host:5432/dbname"
  ]
}
```

**Replace** with your actual `DATABASE_URL` (or a connection string to the same DB).

**Security:** Avoid committing real credentials. Use env vars if your MCP host supports them:

```json
"postgres": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-postgres",
    "postgresql://localhost/gateflow"
  ],
  "env": {
    "PGPASSWORD": "your_password"
  }
}
```

Or pass the full URL from `.env` — Cursor may support `"$DATABASE_URL"` in args; verify in Cursor MCP docs.

---

## File locations

| Location        | Scope                    |
|----------------|--------------------------|
| `.cursor/mcp.json` | This project only      |
| `~/.cursor/mcp.json` | All Cursor projects |

---

## Troubleshooting

- **Prisma MCP fails:** Run `cd packages/db && npx prisma generate`; ensure `DATABASE_URL` is set.
- **GitHub MCP fails:** Confirm Docker is running; PAT has `repo` and `read:org`.
- **Postgres MCP fails:** Check connection string and that the DB is reachable.

---
generated: YYYY-MM-DD
update_trigger: route-added, route-removed
---

# API Routes Map

> Maintained manually. Update when routes are added or removed.
> Format: `METHOD /path — Auth — Description`

---

## Public Routes (no auth)

- `POST /api/auth/login — none — User login`
- `POST /api/auth/refresh — none — Token refresh`

---

## Protected Routes (auth required)

### Users

- `GET /api/users/me — session — Get current user profile`

### Organizations

- `GET /api/organizations/:id — session + org — Get org details`

---

## Admin Routes

- `GET /api/admin/metrics — admin-key — Platform metrics`

---

## Conventions

- All routes return `{ data, error }` envelope
- Auth errors: 401 (unauthenticated), 403 (forbidden)
- Validation errors: 422 with `{ error, details }`
- All mutations require org-scoped session

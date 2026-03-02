# Explore Subagent — GateFlow Prompts

Copy one of these prompts when invoking the **explore** subagent.

---

## Trace flow

```
Trace the end-to-end flow for [QR creation / scan validation / bulk sync] (UI → API routes → DB models). Return the key files and a short call graph.
```

---

## Refactor discovery

```
Find all places where [symbol/string] is used across apps/packages and group by feature area.
```

---

## Route inventory

```
List all API routes under [path] and summarize inputs/outputs/auth requirements.
```

---

## Multi-tenant check

```
Find all places where organizationId is used in [app name] and verify multi-tenant scoping.
```

---

## QR / scanner flow

```
Where is QR signature verified and how is it used by scanner sync?
```

---

## Onboarding flow

```
List all API routes involved in onboarding and token issuance.
```

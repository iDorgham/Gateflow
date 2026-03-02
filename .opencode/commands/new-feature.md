---
description: Create a new feature following the GateFlow patterns
agent: build
---

Create a new feature following GateFlow development patterns:

1. First, understand the feature requirements by asking clarifying questions
2. Check existing patterns in the codebase:
   - API routes in apps/client-dashboard/src/app/api/
   - Components in apps/client-dashboard/src/components/
   - Database models in packages/db/prisma/schema.prisma
3. Follow the conventions:
   - Use Prisma for database operations
   - Use the @gate-access/ui components
   - Implement proper auth with requireAuth
   - Always scope queries by organizationId
4. Create a plan before implementing

Wait for the user to describe the feature they want to create.

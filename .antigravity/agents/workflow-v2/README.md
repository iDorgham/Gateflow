# Workflow v2 specialist contract

Every specialist returns one result packet:

1. focused app, stage, role, and scope;
2. artifacts read or changed;
3. findings or implementation result;
4. verification evidence and freshness;
5. risks/blockers;
6. exactly one handoff.

`writeAccess: workdir` still requires the focused phase and the single workdir
lock. Reviewers and gatekeepers never implement or approve their own fixes.
External and remote mutations always require separate user authorization.

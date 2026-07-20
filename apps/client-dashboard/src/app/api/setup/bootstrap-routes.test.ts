import fs from 'fs';
import path from 'path';

describe('P0 bootstrap route containment', () => {
  it('does not deploy api/setup/reset-admin route', () => {
    // Resolve from this test file so CWD (turbo/CI wrappers) cannot no-op the check.
    const routePath = path.join(__dirname, 'reset-admin', 'route.ts');
    expect(fs.existsSync(routePath)).toBe(false);
  });
});

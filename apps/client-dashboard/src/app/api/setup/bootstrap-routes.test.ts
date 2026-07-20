import fs from 'fs';
import path from 'path';

describe('P0 bootstrap route containment', () => {
  it('does not deploy api/setup/reset-admin route', () => {
    const routePath = path.join(
      process.cwd(),
      'src/app/api/setup/reset-admin/route.ts'
    );
    expect(fs.existsSync(routePath)).toBe(false);
  });
});

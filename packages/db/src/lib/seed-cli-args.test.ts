import { parseSeedCliArgv, seedCliWantsEmulation } from './seed-cli-args';

describe('seed-cli-args', () => {
  describe('parseSeedCliArgv', () => {
    test('parses dry-run, test-integrity, org range', () => {
      const p = parseSeedCliArgv([
        '--dry-run',
        '--test-integrity',
        '--organizations.min=2',
        '--organizations.max',
        '10',
      ]);
      expect(p.dryRun).toBe(true);
      expect(p.testIntegrity).toBe(true);
      expect(p.organizationsMin).toBe(2);
      expect(p.organizationsMax).toBe(10);
    });

    test('parses emulation flags (kebab and camel)', () => {
      const p = parseSeedCliArgv([
        '--organizationId',
        'org_1',
        '--emulate',
        '--scenario=nightclub',
        '--scans',
        '100',
        '--pastDays=14',
        '--incidentRate',
        '0.2',
        '--seed',
        '7',
        '--projectId=p1',
        '--gateId',
        'g1',
      ]);
      expect(p.emulate.organizationId).toBe('org_1');
      expect(p.emulate.emulateFlag).toBe(true);
      expect(p.emulate.scenario).toBe('nightclub');
      expect(p.emulate.totalScans).toBe(100);
      expect(p.emulate.pastDays).toBe(14);
      expect(p.emulate.incidentRate).toBe(0.2);
      expect(p.emulate.randomSeed).toBe(7);
      expect(p.emulate.projectId).toBe('p1');
      expect(p.emulate.gateId).toBe('g1');
    });

    test('totalScans alias', () => {
      const p = parseSeedCliArgv(['--organizationId=x', '--totalScans=500']);
      expect(p.emulate.totalScans).toBe(500);
    });

    test('parses --demo-full', () => {
      const p = parseSeedCliArgv(['--demo-full']);
      expect(p.demoFull).toBe(true);
      expect(p.dryRun).toBe(false);
    });

    test('help flag', () => {
      expect(parseSeedCliArgv(['--help']).help).toBe(true);
    });

    test('unknown flag throws', () => {
      expect(() => parseSeedCliArgv(['--nope'])).toThrow(/Unknown flag/);
    });
  });

  describe('seedCliWantsEmulation', () => {
    test('false without organizationId', () => {
      expect(
        seedCliWantsEmulation(
          parseSeedCliArgv(['--scenario=nightclub', '--scans=10'])
        )
      ).toBe(false);
    });

    test('true with org + --emulate', () => {
      expect(
        seedCliWantsEmulation(
          parseSeedCliArgv(['--organizationId=o1', '--emulate'])
        )
      ).toBe(true);
    });

    test('true with org + traffic knob only', () => {
      expect(
        seedCliWantsEmulation(
          parseSeedCliArgv(['--organizationId=o1', '--pastDays=3'])
        )
      ).toBe(true);
    });
  });
});

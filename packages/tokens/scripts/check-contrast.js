/**
 * @gateflow/tokens - scripts/check-contrast.js
 * Automated WCAG 2.2 AA Contrast Verification Script (Zero-Dependency Node).
 * Calculates luminance ratios for all semantic foreground/background pairs in Light and Dark modes.
 */

// Hex approximations of OKLCH colors for mathematical luminance verification
const LIGHT_PALETTE = {
<<<<<<< Updated upstream
  canvas: '#f8f9fa',      // layer-01
  surface: '#ffffff',     // layer-02
  raised: '#ffffff',      // layer-03
  overlay: '#ffffff',     // layer-04
  textPrimary: '#0f172a', // text-primary
  textSubtle: '#475569',  // text-subtle
  textBrand: '#c73800',   // text-brand (calibrated Kimchi for >= 4.5:1 on light surface)
  brandAction: '#ed4b00', // brand primary button / UI control (>= 3.0:1)
  textSuccess: '#047857', // text-success (Emerald 700, >= 4.5:1)
  textWarning: '#b45309', // text-warning (Amber 700, >= 4.5:1)
  textDanger: '#dc2626',  // text-danger (>= 4.5:1)
  textAiLab: '#7c3aed',   // text-ai-lab (>= 4.5:1)
=======
  canvas: '#f8f9fa', // layer-01
  surface: '#ffffff', // layer-02
  raised: '#ffffff', // layer-03
  overlay: '#ffffff', // layer-04
  textPrimary: '#0f172a', // text-primary
  textSubtle: '#475569', // text-subtle
  textBrand: '#c73800', // text-brand (calibrated Kimchi for >= 4.5:1 on light surface)
  brandAction: '#ed4b00', // brand primary button / UI control (>= 3.0:1)
  textSuccess: '#047857', // text-success (Emerald 700, >= 4.5:1)
  textWarning: '#b45309', // text-warning (Amber 700, >= 4.5:1)
  textDanger: '#dc2626', // text-danger (>= 4.5:1)
  textAiLab: '#7c3aed', // text-ai-lab (>= 4.5:1)
>>>>>>> Stashed changes
  borderSubtle: '#e2e6eb',
  borderBold: '#cbd2db',
};

const DARK_PALETTE = {
<<<<<<< Updated upstream
  canvas: '#0b0d11',      // layer-01
  surface: '#12151c',     // layer-02
  raised: '#191d26',      // layer-03
  overlay: '#212633',     // layer-04
  textPrimary: '#f8fafc', // text-primary
  textSubtle: '#94a3b8',  // text-subtle
  textBrand: '#ff6934',   // text-brand (lightened Kimchi for dark)
  brandAction: '#ed4b00', // brand primary button / UI control (>= 3.0:1)
  textSuccess: '#34d399', // text-success
  textWarning: '#fbbf24', // text-warning
  textDanger: '#f87171',  // text-danger
  textAiLab: '#a78bfa',   // text-ai-lab
=======
  canvas: '#0b0d11', // layer-01
  surface: '#12151c', // layer-02
  raised: '#191d26', // layer-03
  overlay: '#212633', // layer-04
  textPrimary: '#f8fafc', // text-primary
  textSubtle: '#94a3b8', // text-subtle
  textBrand: '#ff6934', // text-brand (lightened Kimchi for dark)
  brandAction: '#ed4b00', // brand primary button / UI control (>= 3.0:1)
  textSuccess: '#34d399', // text-success
  textWarning: '#fbbf24', // text-warning
  textDanger: '#f87171', // text-danger
  textAiLab: '#a78bfa', // text-ai-lab
>>>>>>> Stashed changes
  borderSubtle: '#232834',
  borderBold: '#363d4e',
};

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function getLuminance(r, g, b) {
<<<<<<< Updated upstream
  const a = [r, g, b].map(v => {
=======
  const a = [r, g, b].map((v) => {
>>>>>>> Stashed changes
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function runAudit() {
  console.log('===========================================================');
  console.log('🔍 GateFlow Design System — WCAG 2.2 AA Contrast Verification');
  console.log('===========================================================\n');

  const tests = [
    // Light Mode Tests (Normal Text >= 4.5:1, UI Controls >= 3.0:1)
<<<<<<< Updated upstream
    { theme: 'Light', fgName: 'textPrimary', fgHex: LIGHT_PALETTE.textPrimary, bgName: 'layer-01 (canvas)', bgHex: LIGHT_PALETTE.canvas, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'textPrimary', fgHex: LIGHT_PALETTE.textPrimary, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'textSubtle', fgHex: LIGHT_PALETTE.textSubtle, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'textBrand', fgHex: LIGHT_PALETTE.textBrand, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'brandAction (CTA)', fgHex: LIGHT_PALETTE.brandAction, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 3.0, type: 'UI Component' },
    { theme: 'Light', fgName: 'textSuccess', fgHex: LIGHT_PALETTE.textSuccess, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'textWarning', fgHex: LIGHT_PALETTE.textWarning, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'textDanger', fgHex: LIGHT_PALETTE.textDanger, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Light', fgName: 'textAiLab', fgHex: LIGHT_PALETTE.textAiLab, bgName: 'layer-02 (surface)', bgHex: LIGHT_PALETTE.surface, minRatio: 4.5, type: 'Text' },

    // Dark Mode Tests (Normal Text >= 4.5:1, UI Controls >= 3.0:1)
    { theme: 'Dark', fgName: 'textPrimary', fgHex: DARK_PALETTE.textPrimary, bgName: 'layer-01 (canvas)', bgHex: DARK_PALETTE.canvas, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textPrimary', fgHex: DARK_PALETTE.textPrimary, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textPrimary', fgHex: DARK_PALETTE.textPrimary, bgName: 'layer-03 (raised)', bgHex: DARK_PALETTE.raised, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textSubtle', fgHex: DARK_PALETTE.textSubtle, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textBrand', fgHex: DARK_PALETTE.textBrand, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'brandAction (CTA)', fgHex: DARK_PALETTE.brandAction, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 3.0, type: 'UI Component' },
    { theme: 'Dark', fgName: 'textSuccess', fgHex: DARK_PALETTE.textSuccess, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textWarning', fgHex: DARK_PALETTE.textWarning, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textDanger', fgHex: DARK_PALETTE.textDanger, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
    { theme: 'Dark', fgName: 'textAiLab', fgHex: DARK_PALETTE.textAiLab, bgName: 'layer-02 (surface)', bgHex: DARK_PALETTE.surface, minRatio: 4.5, type: 'Text' },
=======
    {
      theme: 'Light',
      fgName: 'textPrimary',
      fgHex: LIGHT_PALETTE.textPrimary,
      bgName: 'layer-01 (canvas)',
      bgHex: LIGHT_PALETTE.canvas,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'textPrimary',
      fgHex: LIGHT_PALETTE.textPrimary,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'textSubtle',
      fgHex: LIGHT_PALETTE.textSubtle,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'textBrand',
      fgHex: LIGHT_PALETTE.textBrand,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'brandAction (CTA)',
      fgHex: LIGHT_PALETTE.brandAction,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 3.0,
      type: 'UI Component',
    },
    {
      theme: 'Light',
      fgName: 'textSuccess',
      fgHex: LIGHT_PALETTE.textSuccess,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'textWarning',
      fgHex: LIGHT_PALETTE.textWarning,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'textDanger',
      fgHex: LIGHT_PALETTE.textDanger,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Light',
      fgName: 'textAiLab',
      fgHex: LIGHT_PALETTE.textAiLab,
      bgName: 'layer-02 (surface)',
      bgHex: LIGHT_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },

    // Dark Mode Tests (Normal Text >= 4.5:1, UI Controls >= 3.0:1)
    {
      theme: 'Dark',
      fgName: 'textPrimary',
      fgHex: DARK_PALETTE.textPrimary,
      bgName: 'layer-01 (canvas)',
      bgHex: DARK_PALETTE.canvas,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textPrimary',
      fgHex: DARK_PALETTE.textPrimary,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textPrimary',
      fgHex: DARK_PALETTE.textPrimary,
      bgName: 'layer-03 (raised)',
      bgHex: DARK_PALETTE.raised,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textSubtle',
      fgHex: DARK_PALETTE.textSubtle,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textBrand',
      fgHex: DARK_PALETTE.textBrand,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'brandAction (CTA)',
      fgHex: DARK_PALETTE.brandAction,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 3.0,
      type: 'UI Component',
    },
    {
      theme: 'Dark',
      fgName: 'textSuccess',
      fgHex: DARK_PALETTE.textSuccess,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textWarning',
      fgHex: DARK_PALETTE.textWarning,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textDanger',
      fgHex: DARK_PALETTE.textDanger,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
    {
      theme: 'Dark',
      fgName: 'textAiLab',
      fgHex: DARK_PALETTE.textAiLab,
      bgName: 'layer-02 (surface)',
      bgHex: DARK_PALETTE.surface,
      minRatio: 4.5,
      type: 'Text',
    },
>>>>>>> Stashed changes
  ];

  let failures = 0;

  for (const test of tests) {
    const ratio = getContrastRatio(test.fgHex, test.bgHex);
    const passed = ratio >= test.minRatio;
    const icon = passed ? '✅ PASS' : '❌ FAIL';
    const formattedRatio = ratio.toFixed(2) + ':1';
    const target = '>= ' + test.minRatio + ':1 (' + test.type + ')';

<<<<<<< Updated upstream
    console.log(`[${test.theme}] ${icon} ${test.fgName.padEnd(18)} on ${test.bgName.padEnd(20)} -> Ratio: ${formattedRatio.padEnd(8)} (Target: ${target})`);
=======
    console.log(
      `[${test.theme}] ${icon} ${test.fgName.padEnd(18)} on ${test.bgName.padEnd(20)} -> Ratio: ${formattedRatio.padEnd(8)} (Target: ${target})`
    );
>>>>>>> Stashed changes

    if (!passed) {
      failures++;
    }
  }

  console.log('\n-----------------------------------------------------------');
  if (failures === 0) {
<<<<<<< Updated upstream
    console.log(`🎉 ALL ${tests.length} CONTRAST TESTS PASSED WITH ZERO VIOLATIONS!`);
    console.log('-----------------------------------------------------------\n');
    process.exit(0);
  } else {
    console.error(`🚨 ${failures} CONTRAST PAIRS FAILED TO MEET WCAG 2.2 AA REQUIREMENTS.`);
    console.log('-----------------------------------------------------------\n');
=======
    console.log(
      `🎉 ALL ${tests.length} CONTRAST TESTS PASSED WITH ZERO VIOLATIONS!`
    );
    console.log(
      '-----------------------------------------------------------\n'
    );
    process.exit(0);
  } else {
    console.error(
      `🚨 ${failures} CONTRAST PAIRS FAILED TO MEET WCAG 2.2 AA REQUIREMENTS.`
    );
    console.log(
      '-----------------------------------------------------------\n'
    );
>>>>>>> Stashed changes
    process.exit(1);
  }
}

runAudit();

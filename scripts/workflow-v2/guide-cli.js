#!/usr/bin/env node
const path = require('node:path');
const { loadState } = require('./lib');
const {
  buildGuideSnapshot,
  collectDeliveryEvidence,
  formatGuideUsage,
  renderGuide,
  renderGuideDelivery,
  renderGuideNext,
  renderGuidePrompt,
  resolveGuideSubcommand,
} = require('./guide');

const root = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const json = args.includes('--json');
const value = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};

try {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(formatGuideUsage());
  } else {
    const stateFile = path.resolve(
      value('--state') || path.join(root, '.ai', 'workflow-v2', 'state.json')
    );
    const state = loadState(stateFile);
    const snapshot = buildGuideSnapshot({ root, state });
    const subcommand = resolveGuideSubcommand(args);

    if (subcommand === 'next') {
      const payload = {
        generatedAt: snapshot.generatedAt,
        activeApplication: snapshot.activeApplication,
        currentStage: snapshot.currentStage,
        blockers: snapshot.blockers,
        nextCommand: snapshot.nextCommand,
      };
      console.log(
        json ? JSON.stringify(payload, null, 2) : renderGuideNext(payload)
      );
    } else if (subcommand === 'prompt') {
      const prompt = renderGuidePrompt(snapshot);
      console.log(json ? JSON.stringify(prompt, null, 2) : prompt.text);
    } else if (subcommand === 'delivery') {
      const delivery = collectDeliveryEvidence({ root, snapshot });
      console.log(
        json ? JSON.stringify(delivery, null, 2) : renderGuideDelivery(delivery)
      );
    } else {
      console.log(
        json ? JSON.stringify(snapshot, null, 2) : renderGuide(snapshot)
      );
    }
  }
} catch (error) {
  console.error(`workflow-v2-guide: ${error.message}`);
  process.exitCode = 1;
}

#!/usr/bin/env node

import * as promptly from 'promptly';
import * as kleur from 'kleur';
import {
  updateTsConfig,
  updateElisnt,
  updatePrettier,
  updateEditorConfig,
  updatePackageJson,
} from './utils';

async function init() {
  const nodeOrBrowser = await greeting();

  await updateEditorConfig();
  await updateTsConfig();
  await updateElisnt();
  await updatePrettier();
  await updatePackageJson(nodeOrBrowser);
}

// eslint-disable-next-line no-process-exit
init().then(() => process.exit(0));

async function greeting() {
  console.log(
    kleur.green(kleur.bold('The app will update typescript/linter configs in your project (Local)'))
  );
  console.log(kleur.green(`\t${process.cwd()}\n`));

  console.log(
    kleur.yellow('!!! The script will remove and update files (tsconfig/eslintrc/etc.)\n')
  );
  const answer = await promptly.confirm(kleur.yellow('Do you want to continue? (y/n) '));

  if (!answer) {
    console.log(kleur.red('Aborted'));
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }

  const nodeOrBrowser = await promptly.choose(
    kleur.blue('Are you developing node or browser solution?'),
    ['node', 'browser']
  );

  return nodeOrBrowser;
}

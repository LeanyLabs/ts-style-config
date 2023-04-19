import * as promptly from 'promptly';
import * as kleur from 'kleur';
import { updateTsConfig, updateElisnt, updatePrettier } from './utils';

async function init() {
  await greeting();

  await updateTsConfig();
  await updateElisnt();
  await updatePrettier();
}

init().then(() => process.exit(0));

async function greeting() {
  console.log(
    kleur.green(
      kleur.bold(
        'The app will update typescript/linter configs in your project'
      )
    )
  );
  console.log(kleur.green(`\t${process.cwd()}\n`));

  console.log(
    kleur.yellow(
      '!!! The script will remove and update files (tsconfig/eslintrc/etc.)\n'
    )
  );
  const answer = await promptly.confirm(
    kleur.yellow('Do you want to continue? (y/n) ')
  );

  if (!answer) {
    console.log(kleur.red('Aborted'));
    process.exit(0);
  }
}

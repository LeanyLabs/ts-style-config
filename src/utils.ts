import * as kleur from 'kleur';
import * as fs from 'fs';
import * as path from 'path';

const templatesPath = __dirname.endsWith('build/src')
  ? path.join(__dirname, '..', '..', 'templates')
  : path.join(__dirname, '..', 'templates');

export async function updateTsConfig() {
  console.log(kleur.green('Updating tsconfig...'));

  deleteIfExists('tsconfig.js');

  copyFile('tsconfig.json');
}

export async function updateElisnt() {
  console.log(kleur.green('Updating eslint config...'));

  deleteIfExists('.eslintrc');
  deleteIfExists('.eslintrc.json');

  copyFile('.eslintignore');
  copyFile('.eslintrc.js');
}

export async function updatePrettier() {
  console.log(kleur.green('Updating prettier config...'));

  deleteIfExists('.prettierrc');
  deleteIfExists('.prettierrc.json');

  copyFile('.prettierrc.js');
}

function deleteIfExists(target: string) {
  const targetPath = path.join(process.cwd(), target);
  if (!fs.existsSync(targetPath)) return;

  try {
    fs.unlinkSync(targetPath);
    console.log(kleur.grey(` -- deleted ${target}`));
  } catch (e) {
    console.error(`Failed to delete ${target}:`, e);
  }
}

function copyFile(target: string, source?: string) {
  if (!source) source = target;

  try {
    const targetPath = path.join(process.cwd(), target);
    const sourcePath = path.join(templatesPath, source);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(kleur.grey(` -- copied ${target}`));
  } catch (e) {
    console.error(`Failed to copy ${source} to ${target}:`, e);
  }
}

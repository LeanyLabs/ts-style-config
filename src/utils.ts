import * as kleur from 'kleur';
import * as fs from 'fs';

import * as path from 'path';
import { exec } from 'child_process';

const templatesPath =
  __dirname.endsWith('build/src') || __dirname.endsWith('build\\src')
    ? path.join(__dirname, '..', '..', 'templates')
    : path.join(__dirname, '..', 'templates');

export async function installPackages() {
  try {
    await execSync('yarn add eslint-plugin-node -D');
    await execSync('yarn add eslint-plugin-prettier -D');
  } catch (e) {
    console.error('Failed to install packages:', e);
  }
}

export async function updatePackageJson() {
  console.log(kleur.green('Updating package.json...'));
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: 'eslint --config .eslintrc.js --ext .tsx --ext .ts src',
    'lint:fix': 'eslint --config .eslintrc.js --ext .ts --ext .tsx --fix src',
    format: 'prettier --config .prettierrc.js --write src/**/*.{ts,tsx}',
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export async function updateEditorConfig() {
  console.log(kleur.green('Updating editor config...'));
  copyFile('.editorconfig');
}

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
async function execSync(command: string) {
  console.log(kleur.grey(` -- running command: ${command}`));
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout);
    });
  });
}

import * as kleur from 'kleur';
import * as fs from 'fs';

import * as path from 'path';
import { exec } from 'child_process';

const templatesPath =
  __dirname.endsWith('build/src') || __dirname.endsWith('build\\src')
    ? path.join(__dirname, '..', '..', 'templates')
    : path.join(__dirname, '..', 'templates');

const packagesToAdd: { name: string; dist: string }[] = [
  { name: 'prettier', dist: '-D' },
  { name: 'eslint-plugin-node', dist: '-D' },
  { name: 'eslint-plugin-prettier', dist: '-D' },
  { name: 'eslint-plugin-import', dist: '-D' },
  { name: '@leanylabs/ts-style-config', dist: '-D' },
];

export async function installPackages() {
  const packageJson = getProjectPackageJson();

  const devDependencies = packageJson.devDependencies;
  const dependencies = packageJson.dependencies;

  await execSync('yarn install');

  try {
    for (const packageInfo of packagesToAdd) {
      const currentDist = getCurrentDist({ devDependencies, dependencies }, packageInfo);
      if (currentDist !== null && currentDist !== packageInfo.dist) {
        await execSync(`yarn remove ${packageInfo.name}`);
      }
      await execSync(`yarn add ${packageInfo.name}@latest ${packageInfo.dist}`);
    }
  } catch (e) {
    console.error('Failed to install packages:', e);
  }
}

function getCurrentDist(
  {
    devDependencies,
    dependencies,
  }: { devDependencies: Record<string, any>; dependencies: Record<string, any> },
  packageInfo: { name: string; dist: string }
) {
  let currentDist = null;

  if (devDependencies[packageInfo.name]) {
    currentDist = '-D';
  }

  if (dependencies[packageInfo.name]) {
    currentDist = '';
  }

  return currentDist;
}

function getProjectPackageJson() {
  let projectPacjageJson: Record<string, any> | null = null;
  return (() => {
    if (projectPacjageJson === null) {
      const packageJsonPath = getPathToPackageJson();
      projectPacjageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }

    return projectPacjageJson as Record<string, any>;
  })();
}

function getPathToPackageJson() {
  return path.join(process.cwd(), 'package.json');
}

export async function updatePackageJson(nodeOrBrowser: string) {
  console.log(kleur.green('Updating package.json...'));
  const packageJson = getProjectPackageJson();

  packageJson.scripts = {
    ...packageJson.scripts,
    ...defineLinterCommands(nodeOrBrowser),
  };
  fs.writeFileSync(getPathToPackageJson(), JSON.stringify(packageJson, null, 2));
}

function defineLinterCommands(nodeOrBrowser: string) {
  switch (nodeOrBrowser) {
    case 'node':
      return {
        lint: 'eslint --config .eslintrc.js --ext .ts src',
        'lint:fix': 'eslint --config .eslintrc.js --ext .ts --fix src',
        format: 'prettier --config .prettierrc.js --write src/**/*.{ts}',
      };
    case 'browser':
      return {
        lint: 'eslint --config .eslintrc.js --ext .tsx --ext .ts src',
        'lint:fix': 'eslint --config .eslintrc.js --ext .ts --ext .tsx --fix src',
        format: 'prettier --config .prettierrc.js --write src/**/*.{ts,tsx}',
      };
    default:
      return {
        lint: 'eslint --config .eslintrc.js --ext .tsx --ext .ts src',
        'lint:fix': 'eslint --config .eslintrc.js --ext .ts --ext .tsx --fix src',
        format: 'prettier --config .prettierrc.js --write src/**/*.{ts,tsx}',
      };
  }
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

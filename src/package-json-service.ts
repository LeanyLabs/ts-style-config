import path from 'path';
import fs from 'fs';

export function getProjectPackageJson() {
  let projectPackageJson: Record<string, any> | null = null;
  return (() => {
    if (projectPackageJson === null) {
      const packageJsonPath = getPathToPackageJson();
      projectPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }

    return projectPackageJson as Record<string, any>;
  })();
}

export function getPathToPackageJson() {
  return path.join(process.cwd(), 'package.json');
}

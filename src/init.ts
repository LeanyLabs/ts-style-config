import * as fs from 'fs';
import * as path from 'path';

export function init() {
  deleteIfExists('.eslintrc');
  deleteIfExists('.eslintrc.json');
  deleteIfExists('.prettierrc');
  deleteIfExists('.prettierrc.json');

  overwriteFile(
    '.eslintrc.js',
    String.raw`
module.exports = {
  extends: ['@leanylabs/ts-style-config/.eslintrc.json'],
  rules: {
  
  }
};
`
  );

  overwriteFile(
    '.prettierrc.js',
    String.raw`
module.exports = {
  ...require('@leanylabs/ts-style-config/.prettierrc.json')
}
`
  );

  overwriteFile(
    'tsconfig.json',
    String.raw`
{
  "extends": "@leanylabs/ts-style-config/tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "build"
  },
  "include": [
    "src/**/*.ts",
    "test/**/*.ts"
  ]
}
`
  );
}

function overwriteFile(filename: string, contents: string) {
  try {
    fs.writeFileSync(path.join(process.cwd(), filename), contents);
  } catch (e) {
    console.log(`Failed to overwrite ${filename}:`, e);
  }
}

function deleteIfExists(filename: string) {
  const exists = fs.existsSync(path.join(process.cwd(), filename));
  if (exists) {
    try {
      fs.unlinkSync(path.join(process.cwd(), filename));
      console.log(`Deleted existing ${filename}`);
    } catch (e) {
      console.log(`Failed to delete ${filename}:`, e);
    }
  }
}

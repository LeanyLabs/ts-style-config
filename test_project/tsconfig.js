{
  "extends": "./tsconfig-google.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "build"
  },
  "include": ["src/**/*.ts", "test/**/*.ts"],
  "exclude": ["test/fixtures/**/*.*", "template/**/*.*"]
}

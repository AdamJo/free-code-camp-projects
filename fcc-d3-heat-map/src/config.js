System.config({
  //use typescript for compilation
  transpiler: 'typescript',
  //use tsconfig.json for options
  typescriptOptions: {
    tsconfig: true
  },
  //map tells the System loader where to look for things
  map: {
    app: "./app"  },
  //packages defines our app package
  packages: {
    app: {
      main: './main.ts',
      defaultExtension: 'ts'
    }
  }
});

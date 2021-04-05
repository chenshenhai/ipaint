const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const chalk = require('chalk');
// const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');
const { packages } = require('./config');
const pkgNames = packages.map((pkg) => {
  return pkg.dirName
})

async function main() {

  pkgNames.forEach(async (name) => {
    const target = name;
    const pkgDir = path.resolve(`packages/${target}`);
    // const pkg = require(`${pkgDir}/package.json`)
    await fs.remove(`${pkgDir}/dist`);
  });

  await 
  execa('rollup', [ '-c', './scripts/rollup.config.js', ], { stdio: 'inherit' });

  // // build types
  // pkgNames.forEach(async (name) => {
  //   const target = name;
  //   const pkgDir = path.resolve(`packages/${target}`);
  //   const pkg = require(`${pkgDir}/package.json`);
    
  //   const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
  //   const extractorConfig = ExtractorConfig.loadFileAndPrepare(
  //     extractorConfigPath
  //   );
  //   const extractorResult = Extractor.invoke(extractorConfig, {
  //     localBuild: true,
  //     showVerboseMessages: true
  //   });
    
  //   if (extractorResult.succeeded) {
  //     // concat additional d.ts to rolled-up dts
  //     const typesDir = path.resolve(pkgDir, 'types')
  //     if (await fs.exists(typesDir)) {
  //       const dtsPath = path.resolve(pkgDir, pkg.types)
  //       const existing = await fs.readFile(dtsPath, 'utf-8')
  //       const typeFiles = await fs.readdir(typesDir)
  //       const toAdd = await Promise.all(
  //         typeFiles.map(file => {
  //           return fs.readFile(path.resolve(typesDir, file), 'utf-8')
  //         })
  //       )
  //       await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
  //     }
  //     console.log(
  //       chalk.bold(chalk.green(`API Extractor completed successfully.`))
  //     )
  //   } else {
  //     console.error(
  //       `API Extractor completed with ${extractorResult.errorCount} errors` +
  //         ` and ${extractorResult.warningCount} warnings`
  //     )
  //     process.exitCode = 1
  //   }
  //   await fs.remove(`${pkgDir}/dist/packages`)
  // })

}

main();
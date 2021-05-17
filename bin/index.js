#!/usr/bin/env node
process.title = 'trans';

const commander = require('commander')
const trans = require('../src/index')
const Path = require('path')

commander
.version(require('../package').version)
.usage('<command> [options]')
.command('generate', 'generate file from a template (short-cut alias: "g")')


commander
  .command('jtox <localeFolder> [xsltPath]')
  .description('locale js folder to excel', {
    localeFolder: 'locale js folder ex: ./locale',
    xsltPath: 'xslt file path  ex: a/b.xlsx'
  })
  .action((localeFolder, xsltPath) => {
    trans.jsToExcel(Path.join(process.cwd(), localeFolder), Path.join(process.cwd(), xsltPath))
    console.log('js translate excel done');
  });

commander
  .command('xtoj <xsltPath> [localeFolder]')
  .description('locale js folder to excel', {
    localeFolder: 'locale js folder ex: ./locale',
    xsltPath: 'xslt file path  ex: a/b.xlsx'
  })
  .action((xsltPath, localeFolder) => {
    trans.excelToJs(Path.join(process.cwd(), xsltPath), Path.join(process.cwd(), localeFolder))
    console.log('js translate excel done');
  });
commander.parse(process.argv)


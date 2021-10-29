// import config from './config'
// import { excelToJs, jsToExcel } from './utils/fs'
const utils = require("./utils/fs");

// excelToJs(config.DISTFILEPATH,config.JSPATH)

// jsToExcel(config.READFLODER, config.DISTFILEPATH)
exports.excelToJs = utils.excelToJs;
exports.jsToExcel = utils.jsToExcel;

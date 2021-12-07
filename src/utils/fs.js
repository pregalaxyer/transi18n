const fs = require("fs");
const Path = require("path");
const Excel = require("exceljs");
const Ejs = require("ejs");
String.prototype.trim = function () {
  // if (char) {
  //   if (type == "left") {
  //     return this.replace(new RegExp("^\\" + char + "+", "g"), "");
  //   } else if (type == "right") {
  //     return this.replace(new RegExp("\\" + char + "+$", "g"), "");
  //   }
  //   return this.replace(
  //     new RegExp("^\\" + char + "+|\\" + char + "+$", "g"),
  //     ""
  //   );
  // }
  return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.RTrim = function (c) {
  // if (!c) {
  //   c = " ";
  // }
  var reg = new RegExp("([" + c + "]*$)", "gi");
  return this.replace(reg, "");
};

// 删除文件夹以及文件
function deleteall(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteall(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

exports.deleteall = deleteall;

function readLocaleJs(path) {
  var files = [];
  var txt_obj = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      if (Path.extname(file) === ".js") {
        let file_content = fs.readFileSync(Path.join(path, file), "utf-8");
        let txt = file_content
          .split("export default ")[1]
          .trim()
          .RTrim(";")
          .trim();
        let sheet = {
          name: file,
          value: eval("(" + txt + ")"),
        };
        txt_obj.push(sheet);
      }
    });

    return txt_obj;
  } else {
    console.log(`error: ${path} 文件夹不存在`);
  }
}

exports.readLocaleJs = readLocaleJs;

function mkdir(param) {
  let isWin = process.platform === "win32";
  let pathArray = [];
  let pathLink = "";

  if (isWin) {
    pathArray = param.split("\\");
    pathLink = pathArray[0];
    pathArray.splice(0, 1);
    pathArray.map(function (ele) {
      if (!fs.existsSync(Path.join(pathLink, "\\" + ele))) {
        fs.mkdirSync(Path.join(pathLink, "\\" + ele));
      }
      pathLink += "\\" + ele;
    });
  } else {
    pathArray = param.split("/");
    pathArray.splice(0, 1);
    pathArray.map(function (ele) {
      if (!fs.existsSync(Path.join(pathLink, "/" + ele))) {
        fs.mkdirSync(Path.join(pathLink, "/" + ele));
      }
      pathLink += "/" + ele;
    });
  }
}

function writeFile(path, filename, context) {
  mkdir(path);
  fs.writeFileSync(Path.join(path, filename), context);
}
exports.writeFile = writeFile;

function isNull(params) {
  return Object.prototype.toString.call(params) === "[object Null]";
}
exports.isNull = isNull;

// js文件转Excel
function jsToExcel(READFLODER, DISTFILEPATH) {
  const workbook = new Excel.Workbook();
  function createSheet(table) {
    const sheet = workbook.addWorksheet(table.name);
    sheet.views = [{ state: "frozen", xSplit: 1 }];
    Object.keys(table.value).map((ele) => {
      sheet.addRow([ele, table.value[ele]]);
    });

    const keyCol = sheet.getColumn(1);
    keyCol.width = 50;
    const valCol1 = sheet.getColumn(2);
    valCol1.width = 50;
  }

  let result = readLocaleJs(READFLODER);

  result.map((ele) => {
    createSheet(ele);
  });

  mkdir(Path.dirname(DISTFILEPATH));

  workbook.xlsx.writeFile(DISTFILEPATH);
}

exports.jsToExcel = jsToExcel;

// excel文件转js文件
async function excelToJs(READXSLTFILE, DISTFILEPATH) {
  const workbook = new Excel.Workbook();
  console.log("*****************READXSLTFILE*************************");
  console.log(READXSLTFILE);
  await workbook.xlsx.readFile(READXSLTFILE);
  workbook.eachSheet(function (worksheet) {
    const keyCol = worksheet.getColumn(1);
    const valCol = worksheet.getColumn(2);
    let keyColArr = [];
    let valColArr = [];
    keyCol.eachCell({ includeEmpty: true }, function (cell) {
      keyColArr.push(isNull(cell.value) ? "" : cell.value);
    });
    valCol.eachCell({ includeEmpty: true }, function (cell) {
      valColArr.push(isNull(cell.value) ? "" : cell.value);
    });
    let jsonObj = {};
    keyColArr.map((ele, idx) => {
      jsonObj[ele] = valColArr[idx];
    });
    let result = Ejs.render(
      `
      export default {<% items.forEach(function(item, idx, arr){%>
        <%=item %> : "<%-values[idx] %>",<% }) %>
      }`,
      { items: keyColArr, values: valColArr }
    );
    console.log(result);
    writeFile(DISTFILEPATH, worksheet.name, result);
  });
}
exports.excelToJs = excelToJs;

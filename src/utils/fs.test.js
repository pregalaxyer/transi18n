const { excelToJs, jsToExcel } = require("./fs");
const path = require("path");
test("excel transform json", () => {
  expect(
    excelToJs(
      path.join(__dirname, "../excel/local.xlsx"),
      path.join(__dirname, "../locales")
    )
  ).toBe("123");
});
test("json transform excel", () => {
  expect(
    jsToExcel(
      path.join(__dirname, "../locales"),
      path.join(__dirname, "../excel/local.xlsx")
    )
  ).toBe("llldsds");
});

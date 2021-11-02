const { excelToJs } = require("./fs");
const fs = require("fs");
const path = require("path");
jest.mock("./fs", () => {
  return {
    _isEsModule: true,
    excelToJs: () => {},
  };
});
test("excel transform json", () => {
  expect(
    excelToJs(
      path.join(__dirname, "../excel/local.xlsx"),
      path.join(__dirname, "../locales")
    )
  ).toBe(undefined);
});
// test("json transform excel", () => {
//   expect(
//     jsToExcel(
//       path.join(__dirname, "../locales"),
//       path.join(__dirname, "../excel/local.xlsx")
//     )
//   ).toBe(undefined);
// });

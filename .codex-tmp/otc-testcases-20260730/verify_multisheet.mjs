import fs from "node:fs/promises";
import { SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/prd-baas/outputs/otc-user-transfer-test-cases-20260730/不同银行账户体系下OTC与用户转账测试用例-按功能分Sheet版.xlsx";
const expected = {
  "入口与仪表板": 16,
  "多法域账户": 10,
  "资产兑换": 50,
  "转账给其他用户": 53,
  "客户端交易记录": 12,
  "管理端资金互转": 33,
  "法币出金费用扣除和调账": 95,
  "非功能测试": 8,
};

const input = await fs.readFile(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

for (const [sheetName, caseCount] of Object.entries(expected)) {
  const lastRow = caseCount + 1;
  const startRow = Math.max(1, lastRow - 1);
  const result = await workbook.inspect({
    kind: "table",
    range: `${sheetName}!A${startRow}:G${lastRow}`,
    include: "values,formulas",
    tableMaxRows: 2,
    tableMaxCols: 7,
    maxChars: 4000,
  });
  console.log(`TAIL_${sheetName}`);
  console.log(result.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "post-export formula error scan",
});
console.log("ERROR_SCAN");
console.log(errors.ndjson);
console.log(`TOTAL_CASES=${Object.values(expected).reduce((sum, count) => sum + count, 0)}`);

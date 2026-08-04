import fs from "node:fs/promises";
import { SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/prd-baas/outputs/otc-user-transfer-test-cases-20260730/不同银行账户体系下OTC与用户转账测试用例-含费用扣除与余额调账.xlsx";
const previewPath = "D:/prd-baas/.codex-tmp/otc-testcases-20260730/updated-sections-preview.png";

const input = await fs.readFile(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

for (const range of ["详细测试用例!A180:G195", "详细测试用例!A220:G236", "详细测试用例!A262:G278"]) {
  const result = await workbook.inspect({
    kind: "table",
    range,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 7,
    maxChars: 12000,
  });
  console.log(`RANGE ${range}`);
  console.log(result.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log("ERROR_SCAN");
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "详细测试用例",
  range: "A183:G195",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
console.log(previewPath);

import fs from "node:fs/promises";
import { SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/prd-baas/outputs/otc-user-transfer-test-cases-20260730/不同银行账户体系下OTC与用户转账测试用例.xlsx";
const previewPath = "D:/prd-baas/.codex-tmp/otc-testcases-20260730/existing-test-cases-preview.png";

const input = await fs.readFile(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const head = await workbook.inspect({
  kind: "table",
  range: "详细测试用例!A1:G8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 7,
  maxChars: 5000,
});
console.log(head.ndjson);

const preview = await workbook.render({
  sheetName: "详细测试用例",
  range: "A1:G8",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
console.log(previewPath);

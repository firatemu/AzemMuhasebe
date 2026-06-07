import * as ExcelJS from 'exceljs';

/** Tek sayfalık XLSX (rapor / dışa aktarım ortak kullanım) */
export async function excelOneSheetBuffer(
  sheetName: string,
  headers: string[],
  rows: (string | number | null)[][],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.addRow(headers);
  for (const r of rows) {
    sheet.addRow(r);
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

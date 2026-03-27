---
name: excel-spreadsheets
description: Create, read, and edit Excel (.xlsx) and spreadsheet files. Use when working with .xlsx, .xls, spreadsheets, Excel exports, Google Sheets, or when the user mentions Excel, sheets, or tabular data files.
---

# Excel & Spreadsheets — Create, Read, Edit

## Quick reference

| Stack   | Library      | Use for                              |
|---------|--------------|--------------------------------------|
| Node/TS  | **exceljs**  | Create, read, edit, styling, formulas |
| Node/TS  | **xlsx**     | Lightweight read/write, no styling    |
| Python  | **openpyxl** | Full read/edit, formulas, formatting |
| Python  | **pandas**   | Data-heavy: read, transform, export  |

---

## Node.js / TypeScript

### Install

```bash
pnpm add exceljs
# or for lightweight: pnpm add xlsx
```

### Read Excel

```typescript
import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile('input.xlsx');

const sheet = workbook.getWorksheet(1); // or getWorksheet('Sheet1')
sheet.eachRow((row, rowNumber) => {
  row.eachCell((cell, colNumber) => {
    console.log(rowNumber, colNumber, cell.value);
  });
});
```

### Create and write Excel

```typescript
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Data');

sheet.columns = [
  { header: 'Name', key: 'name', width: 20 },
  { header: 'Email', key: 'email', width: 30 },
  { header: 'Date', key: 'date', width: 15 },
];

sheet.addRows([
  { name: 'Alice', email: 'alice@example.com', date: new Date() },
  { name: 'Bob', email: 'bob@example.com', date: new Date() },
]);

await workbook.xlsx.writeFile('output.xlsx');
```

### Edit existing cells

```typescript
const sheet = workbook.getWorksheet('Data');
sheet.getCell('A2').value = 'Updated Name';
sheet.getCell('B2').value = { formula: 'SUM(C1:C10)' };
await workbook.xlsx.writeFile('output.xlsx');
```

### Stream to Response (Next.js export)

```typescript
const buffer = await workbook.xlsx.writeBuffer();
return new Response(buffer, {
  headers: {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="export.xlsx"`,
  },
});
```

---

## Python

### Install

```bash
pip install openpyxl pandas
```

### Read Excel

```python
import pandas as pd

df = pd.read_excel('input.xlsx', sheet_name=0)
# or for fine control:
import openpyxl
wb = openpyxl.load_workbook('input.xlsx')
sheet = wb.active
for row in sheet.iter_rows(min_row=1):
    print([cell.value for cell in row])
```

### Create and write Excel

```python
# With pandas
df = pd.DataFrame({'Name': ['Alice', 'Bob'], 'Email': ['a@x.com', 'b@x.com']})
df.to_excel('output.xlsx', index=False)

# With openpyxl (more control)
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws['A1'] = 'Name'
ws['B1'] = 'Email'
ws.append(['Alice', 'a@x.com'])
wb.save('output.xlsx')
```

### Edit existing cells

```python
sheet['A2'] = 'Updated Name'
sheet['B2'] = '=SUM(C1:C10)'
wb.save('output.xlsx')
```

---

## CSV ↔ Excel

| From  | To    | Approach                                          |
|-------|-------|---------------------------------------------------|
| CSV   | Excel | `exceljs`: create workbook, add rows from CSV     |
| Excel | CSV   | `exceljs`: read sheet, stream rows to CSV format  |

**Security (CSV export):** Escape `= + - @` and control chars to prevent CSV injection. See `apps/client-dashboard/src/app/api/scans/export/route.ts` for pattern.

---

## Common patterns

- **Headers row**: Use `sheet.getRow(1)` or first row for column names.
- **Date formatting**: Store as Date; set `numFmt: 'yyyy-mm-dd'` on cell.
- **Formula injection**: Never write raw user input as cell value if it starts with `=`, `+`, `-`, `@`.
- **Large files**: Use streaming (`workbook.xlsx.createInputStream()`) or paginate exports.

---

## Related

- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — workflow rules
- `apps/client-dashboard/src/app/api/scans/export/route.ts` — CSV export (formula-injection safe)

# Using the Tool

## Running it

1. Open the correct Revit model.
2. On the **AutoBim Hub** tab, click **Air Terminal Flow Summary**.
3. A **Save As** window appears. Pick your folder. The name `Air_Terminal_Report.xlsx` is already filled in. Keep it or change it, then click **Save**.
4. The tool confirms with `Success! File saved to: ...`, showing where your file went.
5. Open it in Excel.

Want fresh numbers after editing the model? Just click the button again.

## What the tool does

1. **Works on the active model.** Linked models aren't read.
2. **Collects every placed air terminal.** There's no filtering by level, phase, view, workset or design option.
3. **Decides supply or return** by looking for the whole word "supply" or "return" in the Family and Type name. Case doesn't matter.
4. **Reads the Flow parameter**, the read-only Flow value under Mechanical in Properties, and converts it to CFM. Revit stores airflow internally in cubic feet per second, so the report is always in CFM whatever your project units say.
5. **Asks where to save**, then writes the workbook: bold header row, one row per terminal, bold summary row, frozen header, columns sized to fit.

## Reading your report

| Column | What it shows |
| --- | --- |
| **Element ID** | Revit's own number for that terminal |
| **Category** | Always "Air Terminals" |
| **Family** | As shown in Type Properties, e.g. *Supply Diffuser - Square - Hosted* |
| **Type** | As shown in Type Properties, e.g. *12" x 12"* |
| **Air Flow (CFM)** | The Flow parameter, converted. **Blank** if Revit has no flow for that terminal |
| **Total** | Always 1. One row is one terminal |

> **Tip:** copy an Element ID out of Excel, then in Revit go to **Manage → Select by ID** and paste it. Revit selects that exact terminal. Use this to chase down a terminal whose flow looks wrong.

### Blank airflow cells

A blank cell means Revit had no flow figure for that terminal, usually because it isn't connected to ductwork. Blank is used rather than 0 so it can't be mistaken for a real reading of zero. Blank cells are worth chasing, because they normally mean a terminal was placed but never ducted.

### The bold row at the bottom

It isn't a terminal. It's your summary:

| Cell | Value |
| --- | --- |
| Category | "Air Terminal" |
| Air Flow (CFM) | The **average** across the tab. Terminals with a blank flow are left out, so they can't drag it down |
| Total | **How many** terminals are on the tab, including those with a blank flow |

## Messages you may see

| Message | Meaning |
| --- | --- |
| `Success! File saved to: ...` | It worked. The path is where the file went |
| `Export cancelled - no file was saved.` | The Save As window was closed or cancelled |
| `Could not write to ... it is probably open in Excel.` | The file you're overwriting is open on screen |
| `Failed to export: ...` | Anything else. The text after the colon is the actual error |

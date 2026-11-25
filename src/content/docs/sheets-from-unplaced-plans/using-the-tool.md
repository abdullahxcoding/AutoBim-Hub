# Using the Tool

## Steps

1. Open your project in Revit.
2. On the **AutoBim Hub** tab, click **Create Sheets from Unplaced Plans**.
3. Wait a few seconds until it finishes.
4. Read the result. It shows something like:

   ```
   Sheets planned: 12
   Viewports placed: 12
   Issues (failed): 0
   ```

5. In the **Project Browser**, open **Sheets**. You'll see new sheets starting with **WV** (WV001, WV002 …).

## What the results mean

| Line | Meaning |
| --- | --- |
| Sheets planned | How many floor plans needed a sheet |
| Viewports placed | How many floor plans were put on a sheet |
| Issues (failed) | How many had a problem |

If **Issues** is **0**, everything worked.

## Good to know

- Each new sheet has the **same name as the floor plan** on it.
- Sheet numbers never repeat. If WV001 already exists, the tool uses the next free number.
- If a drawing was made smaller to fit, its scale has changed (for example from 1/8" to 1/16").
- Running it a second time does nothing, because all floor plans are already on sheets.

## Undo

If you don't like the result, press **Ctrl+Z** in Revit.

## Common problems

| Problem | What to do |
| --- | --- |
| "No title block types found in the model" | Load a title block into the project and run again |
| Issues is more than 0 | Some floor plans couldn't be placed. Check them and place them by hand |
| A drawing goes past the edge of the sheet | Change that view to a smaller scale by hand |

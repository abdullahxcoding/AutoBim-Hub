# Getting Started

**Create Sheets from Unplaced Plans** finds every floor plan that isn't on a sheet yet, creates a new sheet for it, and places the plan in the middle. If the plan is too big for the sheet, it changes the view scale so it fits.

## The problem

Floor plans must be placed on sheets before they can be printed or issued. Making a sheet and dragging each plan onto it by hand is slow and easy to get wrong.

## What the tool does

When you run it, it will:

- Find every floor plan that is **not on a sheet yet**
- Make a **new sheet** for each one, named after the view
- Put the floor plan in the **middle** of the sheet
- Switch to the next standard scale if the drawing is too big (for example 1/8" → 1/16")

Floor plans already on a sheet are left as they are.

## How it works

1. **Collects existing sheets** (skipping placeholders) so it never creates a duplicate sheet number.
2. **Collects floor plans**, ignoring view templates and anything that isn't a *Floor Plan*.
3. **Finds unplaced floor plans** by checking every viewport in the model.
4. **Chooses the title block**: the preferred title block type, or the first title block type in the model if that isn't found.
5. **Numbers the sheets** `WV001`, `WV002` and so on, skipping numbers that already exist.
6. **Creates sheets and viewports** in a single transaction, centred in the drawing area. If any step fails, it deletes the new empty sheet and records the reason.
7. **Checks the result** and reports the counts.

## At a glance

| | |
| --- | --- |
| Platform | pyRevit (Revit 2022–2026) |
| Where it appears | **AutoBim Hub** tab in the Revit ribbon |
| Handles | Floor Plans only |
| Sheet numbers | `WV001`, `WV002`, … |
| Undo | Ctrl+Z in Revit |

## Next steps

1. [Check the requirements and settings](installation)
2. [Run the tool](using-the-tool)
3. [Read the FAQ and limits](faq)

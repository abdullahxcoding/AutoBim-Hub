# Using the Tool

## Starting

1. Open your model in Revit.
2. On the **AutoBim Hub** tab, click **Import & Export Parameter**.
3. A window asks **What do you want to do?** Choose **Export** or **Import** and press **OK**.

Pressing **Cancel** at any point stops the tool safely and changes nothing.

## Exporting

You're asked **What do you want to export?**

### Schedules

Pick **Schedules** to get your existing Revit schedules into Excel.

1. Tick the schedules you want (use **Select All** / **Select None** to go faster).
2. Press **OK** and choose where to save.
3. The tool asks whether to open the file now.

Each schedule becomes one sheet with the same columns and headers Revit shows.

### Model Elements

Pick **Model Elements** to choose exactly what you want, in four steps:

1. **Categories:** for example *Air Terminals*, *Ducts*, *Pipes*.
2. **Families:** grouped under their category. Tick whole categories or single families.
3. **Types:** Category → Family → Type. Every type in the project is listed, including types loaded but not yet placed.
4. **Parameters**, in three groups:
   - **Instance Parameters:** values belonging to one placed element (*Comments*, *Mark*, *Area*)
   - **Type Parameters:** values shared by every element of that type (*Type Comments*, *Thickness*)
   - **Shared Parameters:** added to the project from a shared parameter file

Press **OK** and choose where to save the file.

| Button | What it does |
| --- | --- |
| Select All / Select None | Ticks or clears everything |
| Expand All / Collapse All | Opens or closes the groups |
| Ticked: *n* | Counts what you've ticked so far |

## The Excel file

There's one sheet per parameter group. Sheets are frozen at the header row and have filter arrows.

**Instance Parameters** and **Shared Parameters**: one row per placed element.

| ElementId | Category | Family | Type | *your parameters…* |
| --- | --- | --- | --- | --- |

**Type Parameters**: one row per **type**, with no ElementId column.

| Category | Family | Type | *your parameters…* |
| --- | --- | --- | --- |

> **Remember:** a type parameter belongs to the type. If you have 12 diffusers of the same type and change a value on the Type sheet, **all 12 change**. That's how Revit works, and it's why there's one row per type rather than one per element.

## Editing in Excel

Change only the **parameter columns** (the ones after Type).

**Don't:**

- rename the sheets (*Instance Parameters*, *Type Parameters*, *Shared Parameters*)
- delete, move or rename the first columns (ElementId / Category / Family / Type)
- rename a type, family or category inside Excel

Those columns are how the tool finds each element.

**Safe to do:**

- leave a cell **empty**, which means *don't change this*. It does **not** clear the value in Revit
- delete whole rows you don't want to import
- sort and filter
- save from Excel normally

**Write values the way Revit shows them:**

| Kind of parameter | Write it like this |
| --- | --- |
| Text | `Level 2 supply` |
| Length / area / flow | `300 mm`, `1.5 m`, `250 m³/h` (include the unit) |
| Yes/No | `Yes` or `No` |
| Whole number | `5` |

## Importing

1. Click **Import & Export Parameter** again and choose **Import**.
2. Select the Excel file you edited.
3. The tool shows a summary **before** touching anything:

   > *5 value(s) on 5 item(s) will be changed in your model.*
   > *You can undo this in Revit with Ctrl+Z.*
   > *Do you want to continue?*

4. Press **Yes** to apply or **No** to stop.
5. The tool reports how many values were updated and lists anything that was skipped.

The whole import is a single Revit transaction, so **one Ctrl+Z undoes all of it**.

## Messages you may see

| Message | Meaning | What to do |
| --- | --- | --- |
| You cancelled… | You pressed Cancel or No | Nothing changed. Run again when ready |
| This Excel file does not look like one created by this tool | Wrong file, or sheets renamed | Choose the file you exported, with its original sheet names |
| The sheet '…' was skipped because its name was changed | A sheet was renamed | Rename it back |
| The sheet '…' was skipped because its first columns were changed | Key columns moved or deleted | Re-export and edit only parameter columns |
| The type '*family* : *type*' was not found in the category '…' | A Type sheet name doesn't match the model | Check for a typo, or re-export if the type was renamed |
| …row *n*: this item was not found in the model | Element deleted, or file from another project | Delete the row, or use the right file |
| '…' is locked in Revit and cannot be changed | Read-only parameter (Revit calculates it) | Nothing to do |
| '…' could not be changed to '…' | Revit didn't accept the value | Write it as Revit shows it, with units, e.g. `300 mm` |
| items of the same type have different values for '…' | Two rows set the same type parameter differently | Make them the same. Only the first value was used |

## Good practice

- **Save the model before importing.** Ctrl+Z works, but a saved file is safer.
- **Export, edit, import, in that order.** Don't reuse an old export after changing the model.
- **Don't rename types between export and import.** The Type sheet finds types by name.
- **Close the Excel file before importing** to avoid confusion over which version you're using.

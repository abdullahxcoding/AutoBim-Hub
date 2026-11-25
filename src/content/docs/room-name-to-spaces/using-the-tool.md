# Using the Tool

## Before you start

**Work on a copy of the model, not the original.** Keep the original in a separate folder.

Prepare your list file first. See [Setup & Requirements](installation).

## Step 1: Open the model

1. Open your working copy of the model in Revit.
2. Go to the mechanical plan view where the spaces are shown.
3. **Save now** (Ctrl+S). If anything goes wrong you can close without saving and return to this point.

## Step 2: Run the tool and choose your list

1. On the **AutoBim Hub** tab, click **Space Name & Number Transfer**.
2. Select your CSV list file.

## Step 3: Review the preview

The tool reads the model and your list, matches them up, and shows what it would change. Nothing has been changed yet.

```
PREVIEW - nothing was modified. 7 changes to apply:
Space '1':  Number '1' becomes 'C101'   |   Name 'Space' becomes 'ROOM-1'
Space '2':  Number '2' becomes 'C102'   |   Name 'Space' becomes 'ROOM-2'
...
```

**This is the checkpoint.** Check a few lines against what you see in Revit. If something looks wrong, cancel, fix the list and run again.

If you see a list of problems instead, the tool has refused to continue and written nothing. See the messages table below.

## Step 4: Apply the changes

Confirm to apply. The tool writes the changes, then reads every value back out of the model:

```
=== APPLIED 7 CHANGES ===
WROTE   Space '1':  Number '1' becomes 'C101'   |   Name 'Space' becomes 'ROOM-1'
...
--- VERIFICATION (read back from the model) ---
OK        'C101' / 'ROOM-1'
OK        'C102' / 'ROOM-2'
```

Every verification line should say `OK`. If any line says `MISMATCH`, stop and undo.

## Step 5: Check the model and save

The space tags should now read `C101` / `ROOM-1` instead of `Space` / `1`. Click a space and check that **Number** and **Name** in the Properties panel show the new values. Then save the Revit file.

> **Room Number** and **Room Name** on a Space are greyed out and may still say `Unoccupied`. That is normal. Revit fills those from an architectural room, and nobody can type into them. The tool writes the space's own **Number** and **Name**, which are the correct fields.

## If something goes wrong

- Press **Ctrl+Z** in Revit. All changes were made as one action, so one undo removes all of them.
- Or close the model **without saving** and reopen it. You saved at Step 1.

## What the messages mean

### Everything is fine

| Message | Meaning |
| --- | --- |
| `FOUND 7 SPACES` | The tool can see the spaces in the model |
| `ROWS READ: 7` | The list file was read correctly |
| `PROBLEMS (0)` / `(none)` | Nothing wrong was found |
| `APPLIED 7 CHANGES` | The changes were written. Check the verification lines |
| `OK  'C101' / 'ROOM-1'` | Value read back from the model and correct |
| `already correct - no change needed` | That space already has the right values |

### The job was stopped (nothing was written)

| Message | Meaning | What to do |
| --- | --- | --- |
| `missing column(s)` | A heading is missing or misspelled | Compare with the required headings |
| `CSV row 4: blank value` | A cell on that row is empty | Fill it in |
| `CSV row 5: duplicate key '3'` | Space 3 is listed twice | Delete the wrong row |
| `CSV row 6: no space in the model has Number '8'` | The list names a space that isn't in the model | Fix the typo, or check you have the right model open |
| `MODEL: space '4' has no row in the CSV` | A space in the model isn't in your list | Add the row |
| `MODEL: space Id ... has a blank Number` | A space has no number, so it can't be matched | Give it a number in Revit |
| `MODEL: Number '3' is used by more than one space` | Two spaces share a number | Fix the duplicate in Revit |

### Stop and report

| Message | What to do |
| --- | --- |
| `MISMATCH expected 'C101' but found ...` | Don't save. Press Ctrl+Z and report it |
| `parameter is read-only` | Report it. The tool tried to write a locked field |
| `EXCEPTION - transaction closed` | Press Ctrl+Z, close without saving, and report the message |

# Setup & Requirements

## Requirements

- Autodesk Revit 2022 – 2026
- pyRevit 4.8 or newer
- A model that contains **mechanical Spaces**
- Every space has a **Number**, and no two spaces share the same Number
- An input list in the format below

Model size, number of levels, template and naming standard do not matter.

## Installing

1. Download the installer from the product page.
2. Close Revit.
3. Run the installer and follow the prompts.
4. Start Revit. **Space Name & Number Transfer** appears on the **AutoBim Hub** tab.

## Preparing the input list

The tool reads a small **CSV** file. It opens in Excel and looks like a normal table. It must have exactly these three headings, spelled exactly like this:

```
SpaceNumber,NewRoomNumber,NewRoomName
```

| Column | What goes in it | Example |
| --- | --- | --- |
| `SpaceNumber` | The number the space has in Revit **right now** | `1` |
| `NewRoomNumber` | The room number from the drawing | `C101` |
| `NewRoomName` | The room name from the drawing | `ROOM-1` |

Example:

```
SpaceNumber,NewRoomNumber,NewRoomName
1,C101,ROOM-1
2,C102,ROOM-2
3,C103,ROOM-3
```

### The first column is the key

The tool can't see the drawing. The only way it knows where to write `C101` is the first column: `SpaceNumber` `1` means *the space that currently has the number 1 in Revit*.

**Don't assume space 1 is C101, space 2 is C102 and so on.** Spaces are numbered in the order someone placed them, which is usually not the order of the room numbers. Check in the model.

### Finding the space numbers

1. Open the mechanical plan view in Revit.
2. Click inside a space. The Properties panel should say **Spaces (1)** at the top. If it says something else, you clicked a wall. Press Tab until it says Spaces.
3. Read the **Number** field.
4. The space turns light blue when selected. Whatever CAD text is inside that area belongs to that space.

### Rules the list must follow

- One row for every space you want to change.
- Every `SpaceNumber` must exist in the model.
- No `SpaceNumber` may appear twice.
- No cell may be left empty.
- No spaces before or after the text. `C101 ` is not the same as `C101`.
- Capital letters matter. `ROOM-1` and `Room-1` are different. Pick one style and use it for every row.

### Saving the file

- **Excel:** Save As, then choose **CSV UTF-8 (Comma delimited)**.
- **Notepad:** File, Save As, set **Encoding** to **UTF-8**, choose **All Files**, and end the name in `.csv`. Otherwise Notepad saves `rooms.csv.txt`, which won't show up as a CSV.

### Common list mistakes

| What you see | What went wrong |
| --- | --- |
| All three headings show as one long heading | The file used semicolons instead of commas (some regional Windows settings). Re-save it with commas |
| `no space in the model has Number '8'` | The list has a row for a space that doesn't exist |
| `duplicate key` | The same space number is listed twice |
| Strange symbols at the start of the first heading | The file wasn't saved as UTF-8 |

Next: [Run the tool](using-the-tool)

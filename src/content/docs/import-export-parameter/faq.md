# FAQ

### Can it create or delete elements?

No. It only changes information on elements that already exist. Modelling stays your job.

### Why can't it write Levels or Materials?

Parameters that point to another element, like a Level or Material picked from a list, can't be safely matched from a name typed in Excel, and a wrong guess could damage the model. They're exported so you can read them, and skipped on import.

### Can I import a schedule back?

No. Schedule exports are read-only.

### Does an empty cell clear the value in Revit?

No. An empty cell means *leave this alone*. You can export ten parameters, fill in one, and the other nine stay exactly as they were.

### Will it create a parameter that doesn't exist?

No. If a parameter doesn't exist in your project, the tool tells you instead of creating it.

### What about read-only parameters?

They're exported, then reported and skipped on import.

### Why are some rows empty on the Instance sheet?

Types that are loaded but not placed have no element to read, so they show as an empty row on the Instance and Shared sheets. Their type values are exported and can be imported normally on the Type sheet.

### Do I need Excel installed?

Not to create the file. The tool writes the `.xlsx` itself. You need Excel, or another spreadsheet program, to edit it.

### How do I undo an import?

Press **Ctrl+Z** once in Revit. The whole import is undone together.

### How do I report a problem?

Use the **Contact** link in the site footer and include your Revit version, what you did, and the message the tool showed.

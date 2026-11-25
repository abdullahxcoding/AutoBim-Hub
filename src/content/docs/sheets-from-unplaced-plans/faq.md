# FAQ

### Which views does it place?

Only **Floor Plans**. Ceiling plans, sections, elevations and 3D views are skipped.

### Can it put several views on one sheet?

No. Each view gets its own sheet.

### Why did my view's scale change?

If a plan is too big for the drawing area, the tool switches it to the next standard scale that fits. Changing the scale changes the view itself, so annotations and anything else using that view are affected too.

### A view wasn't rescaled even though it's too big

If the view uses a view template that controls scale, it can't be rescaled. The tool records this as an issue but still places the view.

### Which title block does it use?

Its preferred title block type. If that isn't found, it uses the first title block type in the model. If there are none, it stops and tells you.

### Will it create duplicate sheet numbers?

No. It reads the existing sheet numbers first and skips any that are already taken.

### What if I run it twice?

Nothing happens the second time, because all floor plans are already on sheets.

### Where can I see which views failed?

The output shows counts only. Check the **Issues** count, then look for floor plans that still aren't on a sheet.

### How do I report a problem?

Use the **Contact** link in the site footer and include your Revit version and the three result lines.

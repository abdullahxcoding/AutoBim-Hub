# FAQ

### What unit is the length in?

Feet, Revit's internal unit, not your project units. If your project is in millimetres, convert your target length to feet first.

### Are the valves connected to the pipe?

No. Valves are placed at the pipe's midpoint as separate elements. They don't split the pipe or connect into it.

### Does the valve size match the pipe?

No. The valve is always the 2" type, whatever the pipe diameter.

### Can I choose a different valve family?

Not currently. The family `Ball Valve - 2-6 Inch` and type `2"` are fixed.

### What happens if I run it twice?

It places a second valve on the same pipes. Undo the first run with Ctrl+Z before running again.

### Some pipes didn't get a valve

Pipes shorter than your length are skipped on purpose. Pipes that fail during placement are skipped too, but aren't listed in the output.

### Can I undo it?

Yes. All valves are placed in one transaction, so one Ctrl+Z in Revit removes them all.

### How do I report a problem?

Use the **Contact** link in the site footer and include your Revit version and the message the tool showed.

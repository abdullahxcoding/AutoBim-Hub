# FAQ & Troubleshooting

### Both tabs are empty

Usually the wrong model is active.

1. Check the Revit title bar. Is the HVAC model really the active one?
2. If the MEP model is a **link** in this file, open the MEP model itself instead.
3. Check your family naming. Terminals are sorted by the whole word "supply" or "return" in their Family or Type name.

### "Export cancelled - no file was saved."

The Save As window was closed or cancelled. Run again, pick a folder and press **Save**.

### "Could not write to ... it is probably open in Excel."

The file you're overwriting is open on your screen. Close it in Excel and run again, or save under a different name.

### Why is the airflow always in CFM?

Revit stores airflow internally in cubic feet per second. The tool converts that to CFM, so the report is consistent whatever your project units are.

### Why are some airflow cells blank instead of 0?

Blank means Revit had no flow value for that terminal, usually because it isn't connected to a duct system. A 0 would look like a real reading. Blank terminals are still counted in the Total but left out of the average.

### Will it change my model?

No. It only reads. You don't need to save Revit afterwards.

### Does it read linked models?

No, only the host model. Open the MEP model directly.

### How do I report a problem?

Use the **Contact** link in the site footer and include your Revit version and the message the tool showed.

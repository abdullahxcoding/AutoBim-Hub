# Setup & Requirements

## Requirements

- Autodesk Revit 2022 – 2026, with the relevant MEP model open and active
- pyRevit 4.8 or newer
- Excel is **not** required to create the report, only to open it

## Installing

1. Download the installer from the product page.
2. Close Revit.
3. Run the installer and follow the prompts.
4. Start Revit. **Air Terminal Flow Summary** appears on the **AutoBim Hub** tab.

## Two checks before every run

### Check the right model is active

Look at the Revit title bar. The tool reads whatever model is open and active. Running it with the architectural or structural model active gives you two empty tabs and no error message. This is the most common mistake.

### Linked models aren't included

The tool reads the host model only. If your MEP model is **linked** into a coordination file, open the MEP model itself and run it there.

Next: [Run it](using-the-tool)

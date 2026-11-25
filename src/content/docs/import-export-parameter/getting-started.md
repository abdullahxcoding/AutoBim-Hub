# Getting Started

**Import & Export Parameter** moves information between **Revit** and **Excel**. It takes parameter values out of your model into an Excel sheet, lets you edit them there, then puts them back into the model.

You don't need to know any programming. Everything is done through small windows that ask you questions.

## The problem it solves

Filling in Comments on 50 air terminals, putting a Mark on every duct on a floor, or typing airflow figures from a calculation sheet usually means: click an element, find the field, type the value, repeat 50 times. It's slow, and because it's repetitive it's easy to skip an element or type into the wrong box.

It's worse when the data already exists somewhere else, such as a supplier's equipment list, a client room list or an engineer's calculation sheet. It's almost always in Excel, and someone has to copy it into Revit by hand.

## What it does instead

1. **Export.** Answer a few questions (which categories, families, types and parameters) and the tool creates an Excel file.
2. **Edit in Excel.** Sort, filter, fill down, or paste from the supplier's sheet. Changing 50 values takes seconds.
3. **Import.** Give the edited file back. The tool reads your changes and writes them into the model.

**Revit for the model, Excel for the information.** The same job on 300 elements takes the same few minutes as on 3.

## Why you can trust it with your model

- **It shows you what will change first.** For example: *5 value(s) on 5 item(s) will be changed in your model. Do you want to continue?* Nothing is written until you press **Yes**.
- **One Ctrl+Z undoes everything.** The whole import is one action.
- **Cancel always means cancel.** Every window has a Cancel button, and pressing it leaves the model untouched.
- **It tells you when something goes wrong**, in plain words, with the sheet and row.
- **You keep a record.** The Excel file shows what the values were on that day.

## At a glance

| | |
| --- | --- |
| Platform | pyRevit (Revit 2022–2026) |
| Where it appears | **AutoBim Hub** tab in the Revit ribbon |
| Works with | Instance, type and shared parameters; existing schedules (export only) |
| Excel | Not required to create the file, only to edit it |

## Next steps

1. [Check the requirements](installation)
2. [Export, edit and import](using-the-tool)
3. [Read the FAQ and limits](faq)

# Getting Started

**Space Name & Number Transfer** takes a list of room numbers and room names and writes them into the mechanical Spaces of a Revit model automatically, in one run.

It is a reusable tool, not a one-off script. Point it at a different model and a different list and it does the same job. Nothing about any one project is built into it.

## The problem it solves

When an architect's drawing comes in as a CAD file, the mechanical spaces in Revit don't get the real room numbers and names. Revit numbers them `1`, `2`, `3` and calls them all `Space`.

Someone then has to type the real number and name into every space, one at a time. For a building with hundreds of spaces across many floors that can take days, typing mistakes creep in, and it all has to be redone when the architect reissues the drawing. Schedules, airflow calculations, reports and issued drawings all depend on those names.

With the tool, the job is: prepare the list, run it, check the result.

## How it works

You give it a list with three columns:

| Which space (its number in Revit now) | New number | New name |
| --- | --- | --- |
| 1 | C101 | ROOM-1 |
| 2 | C102 | ROOM-2 |

The first column tells the tool **which** space to write into. The other two say **what** to write. It reads every space in the open model, matches them to the list, shows you what it would change, and only writes once you tell it to.

## How it protects your model

1. **It previews first.** In preview mode it prints every change line by line and changes nothing.
2. **It refuses to run if anything is wrong.** A missing space, a blank cell, a duplicate number or a row pointing at a space that doesn't exist: it writes nothing and lists every problem. It never does half the job.
3. **It checks its own work.** After writing, it reads every value back out of the model and confirms it went in correctly.
4. **Nothing changes until you confirm.** After the preview, the tool asks before it writes anything.
5. **One undo removes everything.** All changes are a single action, so one Ctrl+Z reverses the whole run.

## At a glance

| | |
| --- | --- |
| Platform | pyRevit (Revit 2022–2026) |
| Where it appears | **AutoBim Hub** tab in the Revit ribbon |
| Works on | Mechanical **Spaces** (not architectural Rooms) |
| Changes | Each space's **Number** and **Name**, nothing else |

## Next steps

1. [Check the requirements and prepare your list](installation)
2. [Run the tool](using-the-tool)
3. [Read the FAQ and known limits](faq)

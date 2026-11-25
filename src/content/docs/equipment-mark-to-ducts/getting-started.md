# Getting Started

**Equipment Mark to Ducts** passes each piece of mechanical equipment's name down to the ducts attached to it.

## The problem

In an HVAC model, every piece of mechanical equipment carries a short identifying name in its **Mark** field. That's the name the unit is known by on drawings, in schedules and on site.

The ductwork doesn't carry that name anywhere. A duct knows its size, system and level, but not which machine it belongs to. Finding out means tracing the run back by eye or clicking through connections one at a time, which is slow on a small model and impractical on a full building.

## What the tool does

It goes through every piece of mechanical equipment in the model, finds the ducts plugged straight into it, and writes the equipment's **Mark** into those ducts' **Comments** field. Afterwards, the duct itself tells you what it's connected to.

## Why that's useful

- **Identify a duct instantly.** Click it, look at Comments, and you know the machine.
- **Readable schedules.** Add a Comments column to a duct schedule and the list groups by machine.
- **Filter and colour by unit.** Set up views to show only the ducts belonging to one piece of equipment.
- **Easier checking.** A duct that should be connected but has a blank Comment is a sign the connection was never made properly.
- **Seconds instead of hours.** The same job by hand across a full model takes hours, and mistakes creep in.

## How it works

1. Collect all mechanical equipment placed in the model.
2. For each one, read its Mark.
3. Look at its connection points, the sockets where ducts plug in.
4. For each socket with something plugged in, see what's on the other side.
5. If it's a duct, write the equipment's Mark into that duct's Comments.
6. Count what was done and show the totals.

## At a glance

| | |
| --- | --- |
| Platform | pyRevit (Revit 2022–2026) |
| Where it appears | **AutoBim Hub** tab in the Revit ribbon |
| Writes | Duct **Comments**, nothing else |
| Undo | Ctrl+Z in Revit |

## Next steps

1. [Check the requirements](installation)
2. [Run the tool](using-the-tool)
3. [Read the FAQ and limits](faq)

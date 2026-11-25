# Using the Tool

## What it will do to your model

It writes the **Mark** of each piece of mechanical equipment into the **Comments** field of the ducts plugged directly into it. Nothing else changes: no geometry is moved and nothing is deleted.

## Running it

1. Open your HVAC model in Revit.
2. On the **AutoBim Hub** tab, click **Equipment Mark to Ducts**. On a large model it may take a little while.
3. Read the summary the tool shows when it finishes.

## Reading the result

| Reported figure | Meaning |
| --- | --- |
| **Mechanical equipment found** | How many units were checked |
| **Mechanical equipment skipped** | How many had no usable connection points. A small number is normal |
| **Ducts comment updated** | How many ducts received the equipment name. This is the number that matters |

## Checking it in the model

1. Click a duct that sits right on a piece of equipment.
2. In Properties, scroll to **Comments**. The equipment's Mark should be there.

To see them all at once, create a duct schedule and add a **Comments** column.

## Undoing it

The changes go into Revit's normal undo history. Press **Ctrl+Z** in Revit after running, or close the file without saving.

## Running it again

It's safe to run as many times as you like. Each run writes fresh values over whatever is there, so run it again after you add equipment, rename Marks, or reconnect ductwork.

# Getting Started

**Inline Pipe & Valve Placer** puts a valve in the middle of every long pipe in your Revit model, so you don't have to place them one by one.

## The problem

Placing valves on pipes one at a time takes a long time on large projects. This tool does it automatically: it finds every pipe longer than a length you choose and places a **Ball Valve (2")** at the middle of each one.

## What the tool does

1. **Collects all pipes** in the open model.
2. **Reads each pipe's length** and finds the longest pipe.
3. **Asks for a minimum length.** The longest pipe length is shown as the maximum allowed value. The default is `10`.
4. **Checks your input.** Only numbers from 0 up to the longest pipe length are accepted. Otherwise it shows a message and asks again.
5. **Filters the pipes**, keeping only those longer than your length.
6. **Finds the valve type** `Ball Valve - 2-6 Inch`, type `2"`, in the loaded Pipe Accessory families.
7. **Places one valve at the midpoint** of every filtered pipe, in a single transaction called *Place Valves*.
8. **Reports the result:** how many valves were placed and their Element IDs.

## At a glance

| | |
| --- | --- |
| Platform | pyRevit (Revit 2022–2026) |
| Where it appears | **AutoBim Hub** tab in the Revit ribbon |
| Places | `Ball Valve - 2-6 Inch`, type `2"` |
| Length unit | Feet |
| Undo | One Ctrl+Z in Revit |

## Next steps

1. [Check the requirements](installation)
2. [Run the tool](using-the-tool)
3. [Read the FAQ and limits](faq)

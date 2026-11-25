# Using the Tool

## Steps

1. Open your model in Revit.
2. On the **AutoBim Hub** tab, click **Inline Pipe & Valve Placer**.
3. A small window asks you to **enter a length**.
   - It shows the longest pipe in your model as the highest number you can enter.
   - Only pipes **longer** than your number get a valve.
   - Example: type `10` to put valves only on pipes longer than 10 feet.
4. Click **OK**, or **Cancel** to stop without changing anything.
5. Wait a few seconds. The valves appear in the middle of the pipes.
6. The tool shows how many valves were placed.

## Messages you may see

| Message | Meaning | What to do |
| --- | --- | --- |
| `5 Valve Placed, Valve Id:[...]` | It worked. 5 valves were added | Nothing, you're done |
| `No pipes found` | The model has no pipes | Open a model that has pipes, e.g. plumbing |
| `Cancelled` | You clicked Cancel | Run again if you want to place valves |
| `Ball valve 2" type not found` | The valve family isn't loaded | Load the Ball Valve family and run again |
| `Invalid input` pop-up | Not a number, or the number is too big | Type a number between 0 and the shown maximum |

## Tips

- Lengths are entered in **feet**.
- **Don't run it twice on the same model**, or you'll get two valves on each pipe.
- If you don't like the result, press **Ctrl+Z** in Revit to undo it.

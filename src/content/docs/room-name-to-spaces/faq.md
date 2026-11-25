# FAQ

### Will it work on my project?

If your model has mechanical Spaces, every space has a Number, and no two share the same Number, yes. Run the preview first. It costs nothing and tells you straight away whether the model and the list line up.

### Does it read the room names from the CAD drawing?

No. The numbers and names come from a list that a person prepares. When a CAD drawing is imported, Revit gives a program the lines and shapes from it but not the text, so the words on the drawing aren't available to read. Reading them automatically would mean converting the DWG to DXF and reading the text and its position separately, which is a larger piece of work.

### Does it work on architectural Rooms?

Not currently. It looks for mechanical Spaces only. On a model that uses Rooms it reports finding zero spaces rather than doing anything wrong.

### Why do I need the first column?

The tool can't see the drawing. The number each space already has in Revit is the only thing linking a row in your list to a space in the model.

### Why not just map them in order, 1 to C101, 2 to C102?

Spaces are numbered in the order someone placed them, not in the order of the room numbers. On most models they won't line up, and that mistake would be silent.

### What if the list is wrong?

It refuses and tells you what's wrong. Nothing is written. A model where some spaces are right and some are wrong, with no easy way to tell which, is worse than one that was never touched.

It checks that the list is complete and consistent. It can't check that `C101` is really the right number for that space, so confirm the list against the drawing carefully.

### What if I run it twice?

It says *already correct, no change needed*. Nothing is duplicated.

### Can I undo it?

Yes. One Ctrl+Z in Revit reverses the whole run.

### What does it change?

Only each space's **Number** and **Name**. It doesn't create spaces, and nothing else in the model is touched.

### What should I do on a new project?

Run the tool and stop at the preview. It shows straight away whether the model and the list line up, and nothing is written until you confirm.

### How do I report a problem?

Use the **Contact** link in the site footer and include your Revit version, what you did, and the full message the tool printed.

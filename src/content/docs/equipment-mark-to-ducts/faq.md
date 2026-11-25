# FAQ

### Which ducts does it update?

Straight ducts plugged **directly** into a piece of mechanical equipment.

### What doesn't it update?

- Ducts that reach the equipment through a fitting, elbow or transition (they're one step away)
- Duct fittings, flex duct, pipes or other equipment
- Any duct whose Comments field is locked
- Equipment with no connection points at all

Items it can't handle are counted and skipped. Nothing is deleted and nothing else in the model is touched.

### Will it keep what's already in Comments?

No. Existing Comments on a connected duct are **replaced**, not added to.

### What if a duct connects to two machines?

The Comment ends up holding the Mark of the one processed last.

### What if the equipment has no Mark?

The connected duct's Comments end up empty too. Fill in Marks before running.

### Why are some equipment "skipped"?

They have no usable connection points. A small number is normal.

### Can I undo it?

Yes. Every change goes into Revit's undo history. Press Ctrl+Z, or close without saving.

### Is it safe to run more than once?

Yes. Each run writes fresh values. Run it again after adding equipment, renaming Marks or reconnecting ductwork.

### How do I report a problem?

Use the **Contact** link in the site footer and include your Revit version and the three figures the tool reported.

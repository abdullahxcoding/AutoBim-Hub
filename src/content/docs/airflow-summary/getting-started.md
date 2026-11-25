# Getting Started

**Air Terminal Flow Summary** reads every air terminal in the open Revit model and writes a formatted Excel report, split into **Supply** and **Return**.

Think of it as an air terminal schedule that lands straight in Excel, already split and formatted, ready to send on.

## What it gives you

An Excel file with two tabs:

| Tab | Contains |
| --- | --- |
| **Supply** | Every supply diffuser, grille and register in the model |
| **Return** | Every return grille in the model |

One row per air terminal, with its Element ID, Family, Type and airflow in **CFM**. At the bottom of each tab, a bold row shows **how many** terminals there are and their **average** flow.

## It only reads your model

The tool changes nothing, so it can't damage a project, and you don't need to save Revit afterwards. It's safe to run on a live model mid-coordination.

## At a glance

| | |
| --- | --- |
| Platform | pyRevit (Revit 2022–2026) |
| Where it appears | **AutoBim Hub** tab in the Revit ribbon |
| Output | `Air_Terminal_Report.xlsx` (Supply and Return tabs) |
| Changes to model | None |
| Run time | Under a minute, start to finish |

## Next steps

1. [Check the requirements](installation)
2. [Run it and read the report](using-the-tool)
3. [Troubleshooting and FAQ](faq)

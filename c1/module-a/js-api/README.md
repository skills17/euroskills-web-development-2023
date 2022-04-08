# C1 - Phase one - JS API

In this test project, we create an interactive tool to help officers to arrange VIP seating.

There are following sections in the page.

- File loading area
- VIP sorting area
- Full screen button
- Exporting

The purpose of the tool is to allow swapping VIP names in a grid.

## Competitor Information

The final website has to be available at `http://<hostname>/module-a/phase1`.

## VIP Grid

The grid has 8x4 name boxes, 8 columns, 4 rows. As a tool for staff to use, the colors and backgrounds are not our requirement. But please design the gaps and margins to make it usable, readable, and in a right balance.

The VIP name boxes area should not contain any vertical or horizontal scroll bars.

## VIP Swapping

Names of the VIPs are displayed in a grid view in the VIP area. The user can arrange their position by swapping any two of them by drag and drop.
For example, if the current order is A, B, C. When user drags A and drops onto C, the order updates and becomes C, B, A.

There are 4 ways to load a list of VIPs:

1. Loading the cache stored from the last session.
2. Loading a sample VIP grid.
3. Loading external files from dropping area.

### 1. Loading the cache stored from the last session

The tool should save a copy as cache locally in the web browser that is persistent even when the browser tab is closed. The save happens whenever a change is made to the grid.

When the web page is loaded, the tool should check if there is a cache stored locally, and load the cached list at startup.

### 2. Loading a sample VIP grid

By clicking on a "load sample" button, the user can load a sample VIP grid.

The VIP names are pre-defined and no dynamic changes are needed.
The pre-defined names are:

- Andrew
- Robert
- Steve

When constructing the grid, the names from the list are placed from top left in the grid to the bottom right, from left to right, then from top to bottom. For example:

```
|--------|--------|-------|--------|-------|-------|-------|-------|
| Andrew | Robert | Steve |        |       |       |       |       |
|--------|--------|-------|--------|-------|-------|-------|-------|
|        |        |       |        |       |       |       |       |
|--------|--------|-------|--------|-------|-------|-------|-------|
|        |        |       |        |       |       |       |       |
|--------|--------|-------|--------|-------|-------|-------|-------|
|        |        |       |        |       |       |       |       |
|--------|--------|-------|--------|-------|-------|-------|-------|
```

### 3. Loading external files from dropping area

The user is able to drag an external file containing a list of names of VIPs into the tool, by dropping into the file dropping area.

When the file is dragged over the dropping area, an indicator and a line of text hint is displayed to let the user know this is the area to drop the plain text file.
The tool should construct the VIP grid once the file is dropped.

#### Import text format

The external file to load follows the same format that is exported from this tool. The format is:

The first line is the title, with `# VIP List`.
The second line is empty.
From the 3rd line and the rest,
each line is the name of VIP, with a hyphen and space in front of it.

Please refer to the exporting section.

**All loaded VIP names should be draggable and swappable by the same rule as above.**


## Able to take the VIP sorting area into full-screen

In order to allow better focus on the VIP list, and for the user to present the VIP list in meetings, we need a function to toggle fullscreen mode of the VIP sorting area.

There is a toggle button, when the user clicks on it, the VIP sorting area should show in full screen.

During active full screen mode, only the following elements are visible:

- The VIP drag-and-drop working area
- A button to exit fullscreen

All other elements should be invisible during full screen. The web browser UI and system UI is invisible too.

During full-screen, when the user clicks the exit fullscreen button, or presses the ESC key on the keyboard, the full screen ends and the browser returns to the normal web page view.


## Exporting the VIP list

The final list can be viewed in a plain text view, in markdown format.
The first line is the title, with `# VIP List`.
The second line is empty.
From the 3rd line and the rest,
each line is the name of VIP, with a hyphen and space in front of it.
If there are empty boxes between VIPs, they are exported as hyphen without a name.

Example:

```
# VIP List

- Name 1
- Name 2
-
- Name 3
- Name 4

```

The plain text VIP list is displayed in a textarea.
There are two ways to export this data: copying to clipboard or saving to disk.

### Copying to Clipboard

When the user clicks on the copy-to-clipboard button, the VIP names from the grid are copied into the clipboard. The copied text has the same format of the exported VIP list.


### Downloading as a plain text file

When user clicks on the download button, the web browser triggers a download of a plain text file with the name list as the content. The filename should be "vip-list.txt".

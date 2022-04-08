## A1 Layout
day:: 1


## A1 VIP grid area
day:: 1

### M The grid has 8 columns and 4 rows
mark:: 1
wsss:: 4

### M When changing the VIP area to full screen, the grid stays the same 8x4 layout.
mark:: 1
wsss:: 4

### M When in full-screen, only the VIP grid and exit button is visible
mark:: 0.5
wsss:: 5

### J All controls and buttons in the tool are well laid out
mark:: 1
wsss:: 3

0. The controls and buttons are not aligned at all and have no logical order.
1. The controls and buttons are some how aligned but difficult to use.
2. The controls and buttons are basically aligned in a layout.
3. The controls and buttons are well aligned in a layout and in logical order. It is easy to use and functions are distinguished.


### J The names boxes in grid has good white space balance
mark:: 1
wsss:: 3

0. The white space is either too much or too thin, reading the names in the grid is terrible and make the tool not usable.
1. The white space makes the tools difficult to use. 
2. The white space and grid has good balance.
3. The white space and grid has very good balance and make the tool pleasure to use.

### M The VIP grid area should not have any horizontal and vertical scroll bar
mark:: 1
wsss:: 4

### M Able to swap any two names 
mark:: 1
wsss:: 5

The swaping mechnism is same as test project. It is by swaping the dragged name box and dropped box.

## A2 Loading Default VIP names
day:: 1

### M Default names button
mark:: .5
wsss:: 5

There is a button to load default VIP list.

### M By clicking on a button, the user can load a sample list as the VIP list.
mark:: 1
wsss:: 5

When the button is clicked, the grid is reset to contain only 3 names: Andrew, Robert, Steve.

Deduct 0.5 ponits for each missing or incorrect name.


### M Loading the sample list correctly
mark:: .5
wsss:: 5

This sample list is pre-defined. They are:

- Andrew
- Robert
- Steve


## A3 Loading external files
day:: 1


### M User is able to drag the exported files containing a list of names of VIPs into the tool
mark:: .5
wsss:: 5

by dropping into the file dropping area.


### M When the file is dragged over the dropping area, there is indicator
mark:: 1
wsss:: 5

There are two visual clues: An indicator, and a line of text hints

Deduct .5 point per missing or incorrect.

### M The tool should construct the VIP area once the file are dropped.
mark:: 1
wsss:: 5



## A4 Restoring VIP area states from cache
day:: 1

### M The state and data recovers after re-opening browser
mark:: .5
wsss:: 5

### M The tool should save a copy as cache locally in web browser
mark:: .5
wsss:: 5

The save happens whenever a change are made to the list. The cache stores in Local Storage.


## A5 Exporting
day:: 1

### M Exporting the VIP list to file
mark:: 1
wsss:: 5

It is able to trigger download.

### M File format is correct
mark:: 1
wsss:: 5

The first line is the title, with `# VIP List`.
The second line is empty.
From the 3rd line and the rest, 
each line is the name of VIP, with a hyphen in front of it. 

### M Copying to Clipboard
mark:: .5
wsss:: 5

The copy button exists and when click on it, 
the VIP names are copied to clip board.

The names are in the copied list, regardless of the format.

### M The text to clipboard has correct foramt.
mark:: .5
wsss:: 5

When the text is coipied to the clipboard, the format is correct.

## A6 User Experience
day:: 1

### J The tool is smooth 
mark:: 1
wsss:: 3

When operating the tool, there is no lag feeling caused by JavaScript.

0. The tool is lag and unusable, most operations need long wait due to poor JavaScript implementation.
1. The tool is somehow lag but usable.
2. The tool is smooth most of the time
3. The tool is smooth and don't feel lag at all for all the time.


----

1 	Work organisation and self-management 	0
2 	Communication and interpersonal skills 	0
3 	Website design 	3
4 	Layout 	3
5 	Front-End Development 	10
6 	Back-End Development 	0
7 	Content Management Systems 	0

Total 16

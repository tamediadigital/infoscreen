Local.ch Infoscreen v2
==================

New version of the Local Infoscreen.

- simplified infoscreen code (no preloading,..)
- loading content configuration from a google spreadsheet: the key can/must be provided as a parameter (see below for more instructions)

### Content configuration ###

The infoscreen content is defined using a google spreadsheet. create a your own sheet, make sure to setup the first row with the following structure:
- column 1: Cell **A1** must contain the identifier "**Name**", displayed as title of the page
- column 2: Cell **B1** must contain the identifier "**ContentURL**", url to the slide's content
- column 3: Cell **C1** must contain the identifier "**DisplayTime**", time in seconds until the next slide is loaded

Define new slides by adding rows and fill these 3 attributes. Then call the procedure *File/Publish to the web...* to make it readable from javascript.

### How to load your spreadsheet example ###

The key you need to load your config should be part of the spreadsheet's url or visible when you call the open the dialog: *File/Publish to the web...* 

<code>http://your_host_url?key=0AnrtptTR3KifdG5OVXFxWl9mVHAxYVoybXBTcXU3elE<code>


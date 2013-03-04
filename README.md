Local.ch Infoscreen v2
==================

New version of the Local Infoscreen.

- simplified infoscreen code (no preloading,..)
- loading content configuration from a google spreadsheet: the key must be provided as a parameter

Example:
http://host_url?key=0AnrtptTR3KifdG5OVXFxWl9mVHAxYVoybXBTcXU3elE

Spreadsheet:
- column 1: Name, displayed as title of the page
- column 2: ContentURL, url to the slide content
- column 3: DisplayTime, time in seconds until the next slide is loaded

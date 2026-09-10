Thank you for using Objection.lol! This package contains a standalone web version 
of your project that can be opened in any modern web browser.


QUICK START
-----------

1. Open "play.html" in your web browser
2. Your project will load and play


OFFLINE PLAYBACK (For Projects with Custom Assets)
---------------------------------------------------

If your project uses custom assets (images, sounds, etc. that you uploaded), they
are currently hosted online. To make your project work completely offline:

1. Install Node.js (if not already installed):
   
   Windows:  Download from https://nodejs.org
   Mac:      Download from https://nodejs.org (or: brew install node)
   Linux:    sudo apt install nodejs (Ubuntu/Debian)

2. Run the offline converter:

   Windows:  Double-click "make-offline.bat"
   Mac:      Double-click "make-offline.command"
   Linux:    Run: node make-offline.js

3. Wait for the script to download your custom assets

4. Done! Your project now works completely offline.

Note: You only need to run this once. After conversion, you can move the entire
folder to any computer and it will work without internet.


PROJECT STRUCTURE
-----------------

play.html              - Open this file to view your project
assets.js              - Contains your project's asset definitions
project.js             - Contains your project's scene/case data
title.js               - Contains your project title
make-offline.bat       - Windows: Double-click to download custom assets
make-offline.command   - Mac: Double-click to download custom assets
make-offline.js        - The actual download script (used by the above)
resources/             - Contains all preset assets (images, sounds, fonts)
js/                    - JavaScript code for the player


TROUBLESHOOTING
---------------

Problem:  Node.js is not recognized error
Solution: Make sure Node.js is installed and added to your PATH. Restart your
          terminal after installation.

Problem:  Assets fail to download
Solution: Check your internet connection. Some assets may be from hosts that
          block automated downloads. You may need to download them manually.

Problem:  Project doesn't load
Solution: Make sure you open "play.html" directly in a browser. Some browsers
          have security restrictions when opening local HTML files. Try using
          Chrome, Firefox, or Edge.


SHARING YOUR PROJECT
--------------------

To share this project with others:
1. Zip the entire folder
2. Send the zip file
3. Recipients extract and open "play.html"

If you ran make-offline.js, the recipient won't need internet or Node.js - just
a web browser!


QUESTIONS OR ISSUES?
--------------------

Visit: https://github.com/objection-lol/objection-lol-bugs/issues

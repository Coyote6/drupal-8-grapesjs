# WARNING!
This is just a sandbox at the moment.  Security checks are not in place and things are probably not done the proper way.  Use at your own risk!

## To Install & Configure:
1. Place module in modules folder.
2. Download grapesjs (https://github.com/artf/grapesjs) and place it in the libs/ and name the folder grapesjs.
3. Install module from the extend menu.
4. Go to Config -> Text Formats and Editors
5. Add or Configure One
6. Select "GrapeJS" from the Text editor dropdown.

## To use:
1. Go to an entity with text field and select the format you set GrapesJS to as the Text Editor.
2. Click the "Open Editor" Button and enjoy!

## Quirks/Bugs
1. If you are editing an element and exit before clicking off of the element, the update:component event doesn't fire and the new changes are not sent to the text area to be saved.
2. File uploads are very hackie (but functioning) and are not done the proper way I am sure.
3. File usage is not being set.
4. Theme and other settings are hard coded at the moment. 
5. And many more to come... lol

## Roadmap
1. Add in file usage call.
2. Change the field class for styles to being dynamically set by the element.
3. Add in call to switch to an image style.
4. Figure out what is the best way to load assets for Admins since they have access to all files.
5. Add security to current features.
6. Create new blocks to import views, blocks, and other entities and make sure they are secure.
7. Find a way to display an actual rendered page inside the editor with the header, footer, and other regions and make them non-editable. Then remove on header elements on store. (May only be available to saved entities.)
8. Add the ability to select a blank page template or use default one.
9. Move the grapesjs library to the proper location. Possibly the /vendors directory.
# WARNING!
This is just a sandbox at the moment.  Security checks are not in place and things are probably not done the proper way.  Use at your own risk!

[Drupal 7 version can be found here](https://github.com/Coyote6/drupal-7-grapesjs)... it is more up-to-date than this one at this time.  The JavaScripts and plugins on the Drupal 7 version are a bit more complete.

## To Install & Configure:
1. Place module in modules folder.
2. Download grapesjs (https://github.com/artf/grapesjs/tree/master) and place it in the libs/ and name the folder grapesjs.
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
3. Theme and other settings are hard coded at the moment. 
4. Newly added display of the page is causing errors with drag and dropping, and editing tags are being ignored.
5. And many more to come... lol

## Roadmap
1. Currently working on showing the entire page... and preventing it from being editable
2. Finish drupal blocks and have the values set as a setting instead of ajaxed in.
3. Keep breaking apart the default plugin into smaller more manageable plugins.
4. Add in call to switch to an image style using traits.
5. Figure out what is the best way to load assets for Admins since they have access to all files.
6. Add security to current features.
7. Create new blocks to import views, blocks, and other entities and make sure they are secure.
8. Find a way to display an actual rendered page inside the editor with the header, footer, and other regions and make them non-editable. Then remove on header elements on store. (May only be available to saved entities.)
9. Add the ability to select a blank page template or use default one.
10. Clean up other found plugins to match the same programming patterns.
11. Move the grapesjs library to the proper location. Possibly the /vendors directory.
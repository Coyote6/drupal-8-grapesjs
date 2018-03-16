(function (Drupal, $, grapesjs) {

// Build the plugin
grapesjs.plugins.add('drupal-default', (editor, options) => {

  const pm = editor.Panels;
  const cmds = editor.Commands;
  const km = editor.Keymaps;
  const cc = editor.CssComposer;
  const bm = editor.BlockManager;
  const sm = editor.StorageManager;
  const um = editor.UndoManager;
  const selm = editor.SelectorManager;
  const comps = editor.DomComponents;
  var am = editor.AssetManager;
  
  //
  // Helpers
  //
  var senderBtn = {
    exists : function (sender) {
      if (typeof (sender) == 'object' && typeof (sender.set) == 'function') {
        return true;
      }
      return false;
    },
    deactivate : function (sender) {
      if (this.exists(sender)) {
        sender.set('active', false);
      }
    }
  };
  
  // Phrasing elements.
  var phrasingEls = ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'command', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text'];
  var phrasingElsStr = phrasingEls.join(', ');

  //
  // Storage Manager
  //
  
  // Set the storage manager.
  sm.add('textarea', {
    load: function(keys, clb) {
      var defaultVal = $(options.element).val();
      res = {};
      if (typeof (clb) == 'function') {
        clb(res);
      }
    },
    store: function(data, clb) {
      $(document).click();
      var css = editor.getCss();
      css = css.replace('* { box-sizing: border-box; }', '.field--name-body * { box-sizing: border-box; }');
      css = css.replace('body {margin: 0;}', '');
      var val = editor.getHtml() + '<style>' + css + '</style>';
      console.log( editor.getHtml());
      $(options.element).val(val).attr('data-editor-value-is-changed', 'true');
      if (typeof (clb) == 'function') {
        clb();
      }
    },
  }); 
  sm.setAutosave = true;
  sm.setStepsBeforeSave = 1;
  
  //
  // Commands
  //
  
  // Add the save andd close command.
  cmds.add('saveAndClose', {
    run:  function(editor, sender){
      console.log ('save');
      editor.store();
      $('body > *:not("#gjs")').removeClass('not-gjs');
      $(editor.Config.container).fadeOut();
      senderBtn.deactivate(sender);
  //    var button = pm.getButton('devices-c','select');
  //    console.log(button)
      $(options.element).parents('form').find('input[data-drupal-selector="edit-submit"]').click();
    },
    stop:  function(editor, sender){
    },
  });
  
  // Close
  cmds.add('close', {
    run:  function(editor, sender){
  //    var button = pm.getButton('drupal','redo');
  //    console.log(button)
      console.log ('save');
      
  //    $('.gjs-pn-devices-c .gjs-device-label').click();
      editor.store();
      $('body > *:not("#gjs")').removeClass('not-gjs');
      $(editor.Config.container).fadeOut();
      senderBtn.deactivate(sender);
    },
    stop:  function(editor, sender){
    },
  });
    
  // Cancel
  cmds.add('cancel', {
    run:  function(editor, sender){
      console.log ('undo all');
      um.undoAll();
      um.undo();
      senderBtn.deactivate(sender);
    },
    stop:  function(editor, sender){
    },
  });
  
  // Cancel & Close
  cmds.add('cancelAndClose', {
    run:  function(editor, sender){
      um.undoAll();
      um.undo();
      var origVal = $(editor.Config.container).attr('data-editor-value-original');
      if (typeof (origVal) == 'string') {
        $(options.element).val(origVal);
      }
      $('body > *:not("#gjs")').removeClass('not-gjs');
      $(editor.Config.container).fadeOut();
      senderBtn.deactivate(sender);
    },
    stop:  function(editor, sender){
    },
  });
  
  // Undo
  cmds.add('undo', {
    run:  function(editor, sender){
      console.log ('undo');
      um.undo();
      senderBtn.deactivate(sender);
    },
    stop:  function(editor, sender){
    },
  });
  
  // Redo
  cmds.add('redo', {
    run:  function(editor, sender){
      console.log ('redo');
      um.redo();
      senderBtn.deactivate(sender);
    },
    stop:  function(editor, sender){
    },
  });
  
  // Redo All
  cmds.add('redoAll', {
    run:  function(editor, sender){
      console.log ('redo all');
      um.redoAll();
      senderBtn.deactivate(sender);
    },
    stop:  function(editor, sender){
    },
  });


  //
  // Keyboard Shortcuts
  //

  // On ctrl+s (⌘+s on Mac), close the editor and save content.
  km.add('drupal-default:save-close', '⌘+s, ctrl+s', 'saveAndClose');
  
  // On esc, close the editor
  km.add('drupal-default:close', 'esc, escape', 'close');
  
  // On ctrl+esc (⌘+esc on Mac), cancel the work and close the editor.
  km.add('drupal-default:cancel-close', 'ctrl+esc, ctrl+escape, ⌘+esc, ⌘+escape', 'cancelAndClose');
  
  // On ctrl+z (⌘+z on Mac), cancel the work and close the editor.
  km.add('drupal-default:undo', 'ctrl+z, ⌘+z', 'undo');
  
  // On ctrl+y (⌘+y on Mac), redo the work.
  km.add('drupal-default:redo', 'ctrl+shift+z, ⌘+shift+z', 'redo');

  //
  // Panels & Buttons
  //
  pm.addPanel({
      id: 'drupal',
      visible: true,
      context: 'drupal',
    buttons: []
  });
  
  pm.addButton('drupal',{
      id: 'close',
      className: 'grapesjs-button grapesjs-button--close',
      command: 'close',
      attributes: {
        title: 'Close Editor (esc)'
    },
      active: false,
  });  
  
  pm.addButton('drupal',{
      id: 'saveCloseBtn',
      className: 'grapesjs-button grapesjs-button--save-close',
      command: 'saveAndClose',
      attributes: {
        title: 'Close Editor & Save Content (ctrl+s or ⌘+s)'
    },
      active: false,
  });  
  
  pm.addButton('drupal',{
      id: 'cancelAndClose',
      className: 'grapesjs-button grapesjs-button--cancel-close',
      command: 'cancelAndClose',
      attributes: {
        title: 'Cancel Changes & Close Editor (ctrl+esc or ⌘+esc)'
    },
      active: false,
  });
  
  pm.addButton('drupal',{
      id: 'undoAll',
      className: 'grapesjs-button grapesjs-button--cancel',
      command: 'cancel',
      attributes: {
        title: 'Undo All Changes'
    },
      active: false,
  });          

  pm.addButton('drupal',{
      id: 'undo',
      className: 'grapesjs-button grapesjs-button--undo',
      command: 'undo',
      attributes: {
        title: 'Undo (ctrlt+z or ⌘+z)'
    },
      active: false,
  });  
  
  pm.addButton('drupal',{
      id: 'redo',
      className: 'grapesjs-button grapesjs-button--redo',
      command: 'redo',
      attributes: {
        title: 'Redo (ctrlt+shift+z or ⌘+shift+z)'
    },
      active: false,
  });  
  
  pm.addButton('drupal',{
      id: 'redoAll',
      className: 'grapesjs-button grapesjs-button--redo-all',
      command: 'redoAll',
      attributes: {
        title: 'Redo All Changes'
    },
      active: false,
  });  
  
  


/*
cmds.add ('addWidth', {
  run:  function (editor, sender){
    var deviceManager = editor.DeviceManager;
    deviceManager.add('Tablet2', '900px', {
      widthMedia: '810px', // the width that will be used for the CSS media
    });
  },
  stop: function(){}
});

*/

  //
  // Components
  //
  var textType = comps.getType('text');
  var textModel = textType.model;
  comps.addType('textBlock', {
    model: textModel.extend({
      defaults: Object.assign({}, textModel.prototype.defaults, {
        tagName: 'div',
        name: 'Text Block',
        droppable: true,
        classes: ['txt-block'],
        propagate: ['removable', 'draggable', 'droppable']
      }),
    }, {
      isComponent: function(el) {
        if(el.tagName == 'div' && el.classList.contains('paragraph-txt')){
          return {type: 'paragraphText'};
        }
      },
    }),
    // Define the View
    view: textType.view
  });
  
  //
  // Blocks
  //
  
  // Layout

//
// Todo
//  Make a row and a column block and then just add columns as you need them.
//  
  bm.add('single-column', {
    label: 'Single Column Row',
    category: 'Layout',
    attributes: {
      class:'gjs-fonts gjs-f-b1'
    },
    content: '<div class="row" data-gjs-name="Row" data-gjs-droppable=".cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;">' +
          '<div class="cell" data-gjs-name="Cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;cr=0;bc=0;1;1;0.2;">Col 1</div>' +
         '</div><style>.row {display: flex;justify-content: flex-start;align-items: stretch;flex-wrap: nowrap;padding: 10px;}@media (max-width: 768px) {.row {flex-wrap: wrap;}}</style>'
  });
  
  bm.add('double-column', {
    label: 'Two Column Row',
    category: 'Layout',
    attributes: {
      class:'gjs-fonts gjs-f-b1'
    },
    content: '<div class="row" data-gjs-name="Row" data-gjs-droppable=".cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;">' +
          '<div class="cell" data-gjs-name="Cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;cr=0;bc=0;1;1;0.2;">Col 1</div>' +
          '<div class="cell" data-gjs-name="Cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;cr=0;bc=0;1;1;0.2;">Col 2</div>' +
         '</div>'
  });
  
  bm.add('triple-column', {
    label: 'Three Column Row',
    category: 'Layout',
    attributes: {
      class:'gjs-fonts gjs-f-b1'
    },
    content: '<div class="row" data-gjs-name="Row" data-gjs-droppable=".cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;">' +
          '<div class="cell" data-gjs-name="Cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;cr=0;bc=0;1;1;0.2;">Col 1</div>' +
          '<div class="cell" data-gjs-name="Cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;cr=0;bc=0;1;1;0.2;">Col 2</div>' +
          '<div class="cell" data-gjs-name="Cell" data-gjs-resizable="tl=0;tc=0;tr=0;cl=0;bl=0;br=0;1;cr=0;bc=0;1;1;0.2;">Col 3</div>' +
         '</div>'
  });
  
  // Text
  bm.add('text', {
    label: 'Text Block',
    category: 'Text',
    attributes: {
      class:'gjs-fonts gjs-f-text'
    },
    content: {
      type:'textBlock',
      content: '<p class="paragraph-txt" data-gjs-name="Paragraph" data-gjs-selectable="1" data-gjs-removable="1" data-gjs-toolbar="1" data-gjs-draggable=".paragraph-txt" data-gjs-droppable="' + phrasingElsStr + '">Insert your text here</p>',
      style: {
        margin: '10px 0'
      },
      activeOnRender: 1
    },
  });
  
  bm.add('link', {
    label: 'Link',
    category: 'Text',
    attributes: {
      class:'fa fa-link'
    },
    content: {
      type:'link',
    },
  });
  
  //
  // Media
  //
  
  bm.add('image', {
    label: 'Image',
    category: 'Media',
    attributes: {
      class:'gjs-fonts gjs-f-image'
    },
    content: {
      style: {
        color: '#000000'
      },
      type:'image',
      activeOnRender: 1
    },
  });
  
  bm.add('video', {
    label: 'Video',
    category: 'Media',
    attributes: {
      class:'fa fa-youtube-play'
    },
    content: {
      type: 'video',
      src: '',
      style: {
        height: '350px',
        width: '615px',
      }
    },
  });
  
  bm.add('map', {
    label: 'Map',
    category: 'Media',
    attributes: {
      class:'fa fa-map-o'
    },
    content: {
      type: 'map',
      style: {height: '350px'}
    },
  });

})

})(Drupal, jQuery, grapesjs);
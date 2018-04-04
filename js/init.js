(function (Drupal, $) {

  var uploadFormVals = {};
  var assets = {};
  
  var gjseditor = {
    attach: function attach (element, format) {    

//
// To do!!!!
//
// Fix and do this the right way somehow.
//          
// Currently we are loading a form that contains an upload field.
// Stealing its values, so that we can submit to it from the GrapesJs' Asset Manager
// and then entering them as params.  Then we are manually loading new assets using
// the function getAssets();
//        
      
      $.ajax({
         method: "POST",
         url: "/editor/grapesjs/get-upload-form",
         data: {},
         success: function (data, status, jqxhr) {
          if (status == 'success' && typeof (data) == 'object') {
            $('body').append('<div class="grapesjs-upload-form-container">' + data.form + '</div>').promise().done(function(){
              var vals = $('.grapesjs-upload-form-container form').serializeArray();
              for (var i in vals) {
                if (typeof (vals[i]) == 'object') {
                  uploadFormVals[vals[i].name] = vals[i].value;
                }
                
              }
              
              
              // Add special data needed to trick it into believing it was triggered by the upload button on the form.
              uploadFormVals._triggering_element_name = 'files_upload_button';
              uploadFormVals._triggering_element_value = 'Upload';
              uploadFormVals._drupal_ajax = 1;
              uploadFormVals['ajax_page_state[theme]'] = 'seven';
              uploadFormVals['ajax_page_state[theme_token]'] = '';
              
              // Remove the form once we have the values.
              $('.grapesjs-upload-form-container').remove();
              
            });
          }
         }
      });
      
      if ($('#gjs').length == 0) {
        $('body').append('<div id="gjs"></div>').promise().done(function(){          
          
          // Hide the textarea & grapes container.
          $('#gjs').hide();
        
          // Add a button in its place.
          $(element).after('<div class="gjs-button-container" style="display: flex;align-items: center;justify-content: center;text-align: center;border: 1px solid #d1d1d1; height: 250px;"><div class="gjs-open button">Open Editor</div></div>').promise().done(function(){
            $('.gjs-open').click(function(){
              $('#gjs').fadeIn().focus();
              $('body > *:not("#gjs")').addClass('not-gjs');

            });
          });
          
          // Get the default value.
          var defaultVal = $(element).val();

          // Set up the editor.
          editor = grapesjs.init({
            container : '#gjs',
            height: '100%',
            components: defaultVal + '<style>div.div{padding:5px;min-height: 25px;}</style>',
            storageManager: {
              type: 'textarea',
            },
            plugins: ['drupal-default'],
            pluginsOpts: {
              'drupal-default': {
                element: element,
              },
            },
            assetManager: {
              upload: '/editor/grapesjs/upload?element_parents=files&ajax_form=1&_wrapper_format=drupal_ajax',
              uploadName: 'files[files]',
              params: uploadFormVals
            }
    
          });
          editor.on('component:update', (component) => {
            if (
              typeof(component.is) == 'function' &&
              component.is('image') && 
              typeof (assets[component.attributes.src]) != 'undefined'
            ) {
              var thisAsset = assets[component.attributes.src];
              component.addAttributes({'data-entity-uuid': thisAsset.uuid, 'data-entity-type': thisAsset.entity});
            }
            // Save on every update.
            editor.store();
          });
          editor.on('asset:remove', (asset) => {
            console.log(asset);
          });
          editor.on('asset:upload:start', () => {
            console.log('start');
          });
          editor.on('asset:upload:end', () => {
            console.log('end');
            
          });
          editor.on('asset:upload:error', (error) => {
            console.log('error',error);
          });
          editor.on('asset:upload:response', (response) => {
            
            // Update the build id.
            for (var i = 0; i<response.length;i++) {
              if (response[i].command == 'update_build_id') {
                uploadFormVals.form_build_id = response[i].new;
              }
            }
            //
            // Don't know how to modify drupal's response so we are
            // going to get the results ourselves.
            //            
            getAssets();            
              
          });
            
            
            
        
          
          
          // Prevent the shortcut to save function for web browsers.
          var iFrameDoc = $('#gjs iframe')[0].contentDocument;
          $.each([document, iFrameDoc],function( i, val ) {
            $(val).bind('keydown keyup keypress', function(e) {
              if (e.which == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              else if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            });
          });
          
          // Asset Manager must be called here and not the plugin.
          var am = editor.AssetManager;
          
          var getAssets = function () {
            
            $.ajax({
              method: "POST",
              url: "/editor/grapesjs/get-files",
              data: {},
              success: function (data, status, jqxhr) {
                if (status == 'success' && typeof (data) == 'object') {
                  var newAssets = [];
                  for (var id in data.files) {
                    if (typeof (assets[ data.files[id].src]) ==  'undefined') {
                      var category = '';
                      var a = {
                        category: category,
                        src: data.files[id].src,
                        type: 'image',
                        entity: 'file',
                        uuid: data.files[id].uuid
                      };
                      newAssets[newAssets.length] = a;
                      assets[ data.files[id].src] = a;
                    }
                  }
                  if (newAssets.length > 0) {
                    am.add(newAssets);
                    
                    // Need to make sure images add
                    // data-entity-type="file" 
                    // data-entity-uuid="64fe16f3-9450-4a08-a1f0-53e28ae4d8e3"
                    
                  }
                }
              }
            });
          }
          getAssets();
          
          
      
          
          
      
    /*      
editor.setCustomRte({

  enable: function(el, rte) {
    // If already exists just focus
    if (rte) {
      this.focus(el, rte); // implemented later
      return rte;
    }

    // CKEditor initialization
    rte = CKEDITOR.inline(el, {
      // IMPORTANT
      // Generally, inline editors are attached exactly at the same position of
      // the selected element but in this case it'd work until you start to scroll
      // the canvas. For this reason you have to move the RTE's toolbar inside the
      // one from GrapesJS. For this purpose we used a plugin which simplify
      // this process and move all next CKEditor's toolbars inside our indicated
      // element
      sharedSpaces: {
        top: editor.RichTextEditor.getToolbarEl(),
      }
    });

    this.focus(el, rte); // implemented later
    return rte;
  },
  disable: function(el, rte) {
    el.contentEditable = false;
    if (rte && rte.focusManager) {
      rte.focusManager.blur(true);
    }
  },
  focus: function (el, rte) {
    // Do nothing if already focused
    if (rte && rte.focusManager.hasFocus) {
      return;
    }
    el.contentEditable = true;
    rte && rte.focus();
  },
});
  */    
          
        });

      }
      // Fallback this should not happen.
      else {
        $('body > *:not("#gjs")').removeClass('not-gjs');
        $('#gjs').hide();
        $('.gjs-button-container').show();
      }
    },
    detach : function detach(element, format, trigger){      
      $('body > *:not("#gjs")').removeClass('not-gjs');
      // Remove so new elements can be added via the other editors.
      $('#gjs').remove();
      $('.gjs-button-container').remove();
    },
    onChange: function onChange(element, callback) {
    //  console.log($(element).val());
    },
    /*_loadExternalPlugins: function _loadExternalPlugins(format) {
      var externalPlugins = format.editorSettings.drupalExternalPlugins;

      if (externalPlugins) {
        for (var pluginName in externalPlugins) {
          if (externalPlugins.hasOwnProperty(pluginName)) {
            CKEDITOR.plugins.addExternal(pluginName, externalPlugins[pluginName], '');
          }
        }
        delete format.editorSettings.drupalExternalPlugins;
      }
    }*/
 
  };
  Drupal.editors.grapesjs = gjseditor;
})(Drupal, jQuery); // CKEDITOR
(function (Drupal, $, grapesjs) {
grapesjs.plugins.add('drupal-block', function(editor, options) {
  options = options || {};

  addEditor();
  addComponent();
  addBlock();
  
  var blocks = {};
  $.ajax({
    method: "POST",
    url: "/editor/grapesjs/get-blocks",
    data: {},
    success: function (data, status, jqxhr) {
      if (status == 'success' && typeof (data) == 'object') {
        blocks = data;
      }
    }
  });
  
// ToDo
//
// Need to pull these from the active themes
// and set them to a plugin option
//

  var systemMessagesHTML = '<div class="messages__wrapper layout-container" data-gjs-selectable="false" data-gjs-highlightable="false" data-gjs-propagate="[\'selectable\', \'highlightable\'">' +
                              '<div role="contentinfo" aria-label="Status message" class="messages messages--status" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                                '<h2 class="visually-hidden" data-gjs-selectable="false" data-gjs-highlightable="false">Status message</h2>' +
                                'The system messages will appear here.' +
                              '</div>' +
                            '</div>';
                            
  var userLoginHTML = '<form class="user-login-form" data-drupal-selector="user-login-form" id="user-login-form" accept-charset="UTF-8" data-gjs-selectable="false" data-gjs-highlightable="false" data-gjs-propagate="[\'selectable\', \'highlightable\'">' +
                       ' <div class="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-name form-item-name" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                          '<label for="edit-name" class="js-form-required form-required" data-gjs-selectable="false" data-gjs-highlightable="false">Username</label>' +
                          '<input autocorrect="none" autocapitalize="none" spellcheck="false" data-drupal-selector="edit-name" id="edit-name" name="name" value="" size="15" maxlength="60" class="form-text required" required="required" aria-required="true" type="text" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                        '</div>' +
                        '<div class="js-form-item form-item js-form-type-password form-type-password js-form-item-pass form-item-pass" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                          '<label for="edit-pass" class="js-form-required form-required" data-gjs-selectable="false" data-gjs-highlightable="false">Password</label>' +
                          '<input data-drupal-selector="edit-pass" id="edit-pass" name="pass" size="15" maxlength="128" class="form-text required" required="required" aria-required="true" type="password" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                        '</div>' +
                        '<div data-drupal-selector="edit-actions" class="form-actions js-form-wrapper form-wrapper" id="edit-actions" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                          '<input data-drupal-selector="edit-submit" id="edit-submit" name="op" value="Log in" class="button js-form-submit form-submit" type="submit" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                        '</div>' +
                      '</form>';
                      
  var tasksHTML = '<nav class="tabs" role="navigation" aria-label="Tabs" data-gjs-selectable="false" data-gjs-highlightable="false" data-gjs-propagate="[\'selectable\', \'highlightable\'">' +
                    '<h2 class="visually-hidden" data-gjs-selectable="false" data-gjs-highlightable="false">Primary tabs</h2>' + 
                    '<ul class="tabs primary" data-gjs-selectable="false" data-gjs-highlightable="false">' +
                      '<li class="is-active" data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" class="is-active" data-gjs-selectable="false" data-gjs-highlightable="false">These<span class="visually-hidden">(active tab)</span></a></li>' +
                      '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" data-gjs-selectable="false" data-gjs-highlightable="false">Are</a></li>' +
                      '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" data-gjs-selectable="false" data-gjs-highlightable="false">Example</a></li>' +
                      '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" data-gjs-selectable="false" data-gjs-highlightable="false">Tasks</a></li>' +
                       '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" data-gjs-selectable="false" data-gjs-highlightable="false">AKA Tabs</a></li>' +
                     '</ul>' +
                    '</nav>';
                    
  var actionsHTML = '<ul class="action-links" data-gjs-selectable="false" data-gjs-highlightable="false" data-gjs-propagate="[\'selectable\', \'highlightable\'">' +
                      '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" class="button button-action button--primary button--small">Example Action</a></li>' +
                      '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" class="button button-action button--primary button--small">Example Action</a></li>' +
                      '<li data-gjs-selectable="false" data-gjs-highlightable="false"><a href="http://example.com" data-drupal-link-system-path="path/to/element" class="button button-action button--primary button--small">Example Action</a></li>' +
                    '</ul>';

  function addEditor() {
    editor.Commands.add("openDrupalBlockEditor", {
      run: function(editor, sender, data) {
        
        var component = editor.getSelected();
        console.log (component);
        if (component == null) {
          alert ('biteme 1');
        }
        var id = '';
        if (
          typeof (component.attributes) == 'object' && 
          typeof (component.attributes.attributes) == 'object' && 
          typeof (component.attributes.attributes['data-drupal-block']) == 'string'
        ) {
          id = component.attributes.attributes['data-drupal-block'];
        }
        
        var modalContent = document.createElement("div");
        var selectContainer = document.createElement("div");

        var select = document.createElement("select");
        
        // Default option
        var o = document.createElement("option");
        o.text = '-- Select a Block --';
        o.value = '';
        select.add(o);
        
        $.each(blocks, function (i,v) {
          var o = document.createElement("option");
          o.text = v.admin_label;
          o.value = i;
          select.add(o);
        });
        select.value = id;
        selectContainer.appendChild(select);

        var saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.className = "gjs-btn-prim";
        saveButton.style = "margin-top: 8px;";
        saveButton.onclick = function() {
          
          // Special case for system messages.
          if (select.value == 'system_messages_block') {
            component.components(systemMessagesHTML);
            component.addAttributes({'data-drupal-block': select.value});
            editor.Modal.close();       
          }
          // Special case for user login block.
          else if (select.value == 'user_login_block') {
            component.components(userLoginHTML);
            component.addAttributes({'data-drupal-block': select.value});
            editor.Modal.close();       
          }
          // Special case for tasks (tabs).
          else if (select.value == 'local_tasks_block') {
            component.components(tasksHTML);
            component.addAttributes({'data-drupal-block': select.value});
            editor.Modal.close();       
          }
          // Special case for actions.
          else if (select.value == 'local_actions_block') {
            component.components(actionsHTML);
            component.addAttributes({'data-drupal-block': select.value});
            editor.Modal.close();       
          }
          // All others.
          else {
            $.ajax({
              method: "POST",
              url: "/editor/grapesjs/render-block",
              data: {
                bid: select.value
              },
              success: function (data, status, jqxhr) {
                if (status == 'success' && typeof (data) == 'object') {
                  component.components(data.html);
                  component.addAttributes({'data-drupal-block': select.value});
                  editor.Modal.close();       
              }
              }
            });
          }
          
        };

        modalContent.appendChild(selectContainer);
        modalContent.appendChild(saveButton);

      //  codeViewer.init(select);

        var htmlContent = document.createElement("div");
        htmlContent.innerHTML = component.toHTML();
        htmlContent = htmlContent.firstChild.innerHTML;
      //  codeViewer.setContent(htmlContent);

        editor.Modal
          .setTitle("Configure Block")
          .setContent(modalContent)
          .open();

      //  codeViewer.editor.refresh();
      }
    });
  };

  function addComponent() {
    
    var defaultType = editor.DomComponents.getType('default');
    var _initToolbar = defaultType.model.prototype.initToolbar;
//console.log(defaultType.model.prototype.defaults);
    editor.DomComponents.addType('drupalBlock', {
      model: defaultType.model.extend({
        defaults: Object.assign({}, defaultType.model.prototype.defaults, {
          editable: 0,
          droppable: 0,
          propogate: ['editable', 'droppable']
  			}),
        toHTML: function() {
          var id = 'broken';
          if (
            typeof (this.attributes) == 'object' && 
            typeof (this.attributes.attributes) == 'object' && 
            typeof (this.attributes.attributes['data-drupal-block']) == 'string'
          ) {
            id = this.attributes.attributes['data-drupal-block'];
          }
    			return '<div data-drupal-block="' + id + '">[block]' + id + '[/block]</div>';
    		},
        initToolbar(args) {
          _initToolbar.apply(this, args);

          var toolbar = this.get("toolbar");
          toolbar.push({
              attributes: { "class": "fa fa-gear" },
                command: "openDrupalBlockEditor"
          });
          this.set("toolbar", toolbar);
        }
      },{
        isComponent: function(el) {
          if (typeof el.hasAttribute == "function" && el.hasAttribute("data-drupal-block")) {
            return {type: "drupalBlock"};
          }
        }
      }),
      view: defaultType.view.extend({
        events: {
          dblclick: function(){
            editor.runCommand("openDrupalBlockEditor");
          }
        },
        render: function () {
          var id = '';
          if (
            typeof (this.attr) == 'object' && 
            typeof (this.attr['data-drupal-block']) == 'string'
          ) {
            id = this.attr['data-drupal-block'];
          }
          defaultType.view.prototype.render.apply(this, arguments);
          const comps = this.model.get('components');
          comps.reset();
          

          // Special case for system messages.
          if (id == 'system_messages_block') {
            comps.add(systemMessagesHTML);
          }
          // Special case for user login block.
          else if (id == 'user_login_block') {
            comps.add(userLoginHTML);
          }
          // Special case for tasks (tabs).
          else if (id == 'local_tasks_block') {
            comps.add(tasksHTML);
          }
          // Special case for actions.
          else if (id == 'local_actions_block') {
            comps.add(actionsHTML);
          }
          // All others.
          else {            
            $.ajax({
              method: "POST",
              url: "/editor/grapesjs/render-block",
              data: {
                bid: id
              },
              success: function (data, status, jqxhr) {
                if (status == 'success' && typeof (data) == 'object') {
                  comps.add(data.html);
                }
              }
            });
          }

          
          return this;
        }
      })
    });

  };

  function addBlock() {
    editor.BlockManager.add("drupalBlock", {
      attributes: {class: "fa gjs-f-hero"},
      label: "Drupal Block",
      category: 'Advanced',
      content: '<div data-drupal-block>Double Click to Edit</div>'
    });
  };

});
})(Drupal, jQuery, grapesjs);
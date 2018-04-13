(function (Drupal, $, grapesjs) {

// Default storage plugin for a textfield.
grapesjs.plugins.add('drupal-storage-textfield', (editor, options) => {

	const sm = editor.StorageManager;

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

//
// Trying to prevent losing changes when element is still selected.
//
			$(document).click();

      // Make adjustments to the css
			var css = editor.getCss();
			css = css.replace('* { box-sizing: border-box; }', options.format.editorSettings.fieldSelector + ' * { box-sizing: border-box; }');
			css = css.replace('body {margin: 0;}', '');
			var html = editor.getHtml();
			var doc = document.createElement('html');
      doc.innerHTML = html;

			// Get just the field we are working on if the full view is loaded.
			if ($(options.format.editorSettings.fieldSelector, doc).length > 0) {
			  html = $(options.format.editorSettings.fieldSelector, doc)[0];
			  html = $(html).html();
			}
			
		  html += '<style>' + css + '</style>';			
			$(options.element).val(html).attr('data-editor-value-is-changed', 'true');
			if (typeof (clb) == 'function') {
				clb();
			}
		},
	}); 
	sm.setAutosave = true;
	sm.setStepsBeforeSave = 1;

});
})(Drupal, jQuery, grapesjs);
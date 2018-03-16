<?php

/**
 * @file
 * Hooks specific to the grapesjs module.
 */

/**
 * Alter the definitions of all the GrapesJs plugins.
 *
 * You can implement this hook to do things like change the properties for each
 * plugin or change the implementing class for a plugin.
 *
 * This hook is invoked by GrapesJsPluginManager::__construct().
 *
 * @param array $plugin_info
 *   This is the array of plugin definitions.
 */
function hook_grapesjs_info_alter (array $plugin_info) {
  foreach ($plugin_info as $plugin_id => $plugin_definition) {
    $plugin_info[$plugin_id]['foobar'] = t('We have altered this in the alter hook');
  }
}

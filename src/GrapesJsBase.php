<?php

namespace Drupal\GrapesJs;

use Drupal\Component\Plugin\PluginBase;
use Drupal\editor\Entity\Editor;


/**
 * Defines a base GrapesJs plugin implementation.

 * This base class assumes that your plugin has buttons that you want to be
 * enabled through the toolbar builder UI.
 * @see plugin_api
 */
abstract class GrapesJsBase extends PluginBase implements GrapesInterface {

  /**
   * {@inheritdoc}
   */
  public function getDependencies(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [];
  }
  


}

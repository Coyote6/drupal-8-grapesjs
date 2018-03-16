<?php

namespace Drupal\GrapesJs;

use Drupal\Component\Plugin\PluginInspectionInterface;
use Drupal\editor\Entity\Editor;

/**
 * Defines an interface for (loading of) Editor plugins.
 *
 * @see plugin_api
 */
interface GrapesJsInterface extends PluginInspectionInterface {

  /**
   * Indicates if this plugin is part of the optimized CKEditor build.
   *
   * Plugins marked as internal are implicitly loaded as part of CKEditor.
   *
   * @return bool
   */
  public function isInternal();

  /**
   * Returns a list of plugins this plugin requires.
   *
   * @param \Drupal\editor\Entity\Editor $editor
   *   A configured text editor object.
   * @return array
   *   An unindexed array of plugin names this plugin requires. Each plugin is
   *   is identified by its annotated ID.
   */
  public function getDependencies(Editor $editor);

  /**
   * Returns a list of libraries this plugin requires.
   *
   * These libraries will be attached to the text_format element on which the
   * editor is being loaded.
   *
   * @param \Drupal\editor\Entity\Editor $editor
   *   A configured text editor object.
   * @return array
   *   An array of libraries suitable for usage in a render API #attached
   *   property.
   */
  public function getLibraries(Editor $editor);


}

<?php

namespace Drupal\GrapesJs\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a GrapesJs annotation object.
 *
 * @see \Drupal\GrapesJs\GrapesJsPluginManager
 * @see plugin_api
 *
 * @Annotation
 */
class GrapesJs extends Plugin {
	
  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The human-readable name of the CKEditor plugin.
   *
   * @ingroup plugin_translatable
   *
   * @var \Drupal\Core\Annotation\Translation
   */
  public $label;

}

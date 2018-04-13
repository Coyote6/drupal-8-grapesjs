<?php
 
/**
 * @file
 * Contains \Drupal\grapesjs\Controller\AjaxController.
 */
 
namespace Drupal\grapesjs\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal;
use Drupal\Core\Entity\Query\QueryFactory;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\file\Entity\File;

class AjaxController extends ControllerBase {

  public function __construct(QueryFactory $entity_query) {
    $this->entity_query = $entity_query;
  }
  
  public static function create(ContainerInterface $container) {
    return new static(
     $container->get('entity.query')
    );
  }

  public function getUploadForm() {
    $form = Drupal::formBuilder()->getForm('Drupal\grapesjs\Form\GrapesJsUploadForm');
    $html = Drupal::service('renderer')->renderRoot($form);  
    $json = [
      'form' => $html,
      'test' => 'test'  
    ];
    return new JsonResponse($json);
  }
  
  protected function getFilesQuery ($uid) {
    $query = $this->entity_query->get('file')
      ->condition('uid', $uid);
    $fids = $query->execute();
    return array_values($fids);
  }
  
  public function getFiles () {
    $current_user = Drupal::currentUser();
    $uid = $current_user->id();
    $fids = $this->getFilesQuery ($uid);
  
    $files = [];
    $fileObjs = File::loadMultiple($fids);
    foreach ($fileObjs as $fid => $fo) {
      $files[$fid] = [
        'src' => $fo->url(),
        'size' => $fo->getSize(),
        'filemime' => $fo->getMimeType(),
        'uuid' => $fo->uuid()
      ];
    }

    $json = [
      'files' => $files,
      'test' =>'' 
    ];
    return new JsonResponse($json);
  }
  
  public function getBlocks () {
    
    $blockManager = \Drupal::service('plugin.manager.block');
    $contextRepository = \Drupal::service('context.repository');
    $json = $blockManager->getDefinitionsForContexts($contextRepository->getAvailableContexts());
    
    // Remove unwanted blocks because of security, user interface, and/or infinite loop reasons.
    if (isset ($json['broken'])) {
      unset ($json['broken']);
    }
    if (isset ($json['system_main_block'])) {
      unset ($json['system_main_block']);
    }
    if (isset ($json['devel_execute_php'])) {
      unset ($json['devel_execute_php']);
    }
    if (isset ($json['devel_switch_user'])) {
      unset ($json['devel_switch_user']);
    }
    
    // Remove unwanted blocks because they require context and I do not know how to set it yet.
    if (isset ($json['entity_view:node'])){
      unset ($json['entity_view:node']);
    }
    if (isset ($json['entity_view:user'])){
      unset ($json['entity_view:user']);
    }
    if (isset ($json['entity_view:webform'])){
      unset ($json['entity_view:webform']);
    }
    if (isset ($json['entity_view:webform'])){
      unset ($json['entity_view:webform']);
    }
    
    // Throws errors... probably neededs context.
    if (isset ($json['webform'])){
      unset ($json['webform']);
    }
    if (isset ($json['webform_submission_limit_block'])){
      unset ($json['webform_submission_limit_block']);
    }
    
    return new JsonResponse($json);
  
  }
  
  public function renderBlock () {
    
    $bid = \Drupal::request()->request->get('bid');
    
    $bid = trim($bid);
    $html = '';
    
    if (preg_match ('|^[0-9]+|i', $bid)) {            
      $html = renderContentBlock ($bid);
    }
    else if (preg_match ('|^[a-z0-9:\-\_]+$|i', $bid)) {
      $html = renderPluginBlock ($bid);
    }
    else {
          /*  $json = json_decode($bid);
            if ($json) {
              return renderPluginBlock ($json->id, $json);            
            }*/
      $html = 'Double Click to Configure Block';
    }
    
    $json = [
      'bid' => $bid,
      'html' => $html
    ];
    
    return new JsonResponse($json);
  }
  
} 

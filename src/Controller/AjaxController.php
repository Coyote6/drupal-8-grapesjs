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
  
} 

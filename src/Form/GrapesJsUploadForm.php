<?php
  
/**
 * @file
 * Contains \Drupal\grapesjs\Form\GrapesJsUploadForm.
 */
  
namespace Drupal\grapesjs\Form;
  
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\HttpFoundation\JsonResponse; 
 
class GrapesJsUploadForm extends FormBase {
   
   /**
   * {@inheritdoc}.
   */
  public function getFormId() {
    return 'grapesjs_upload_form';
  }
    
  /**
   * {@inheritdoc}.
   */
  public function buildForm (array $form, FormStateInterface $form_state) {
    $form['files'] = [
      '#type' => 'managed_file',
      '#upload_location' => 'public://editor/grapesjs/',
      '#multiple'=> TRUE,
        '#description' => t('Allowed extensions: gif png jpg jpeg'),
        '#upload_validators' => [
        'file_validate_is_image' => array(),
        'file_validate_extensions' => array('gif png jpg jpeg'),
        'file_validate_size' => array(25600000)
       ],
      '#title' => t('Upload Image'),
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];
 
    return $form;
  }
    
  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) { 
  // Do nothing as we are going around this form.
  }
    
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  // Do nothing as we are going around this form.
  }

}

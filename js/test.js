(function ($) {
  
  
  $(document).ready(function(){
    
    $('header').click(function(e){
      e.preventDefault();
      e.stopPropagation();

      
      /*
      $.ajax({
         method: "POST",
         url: "/editor/grapesjs/upload",
         data: {
          op: $('form.grapesjs-upload-form').find('input[name="op"]').val(),
          form_build_id: $('form.grapesjs-upload-form').find('input[name="form_build_id"]').val(),
          form_token: $('form.grapesjs-upload-form').find('input[name="form_token"]').val(),
          form_id: $('form.grapesjs-upload-form').find('input[name="form_id"]').val()
         },
         success: function (data, status, jqxhr) {
           console.log(data,status);
         }
      });  */  
      
    });
    
    $('form').submit(function (e){
      var values = $(this).serialize();
      console.log(values);
      e.preventDefault();
    });
    
  });
  
  
})(jQuery);
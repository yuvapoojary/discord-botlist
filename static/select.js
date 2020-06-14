



    $(document).ready(function() {

      let last_valid_selection = null;

      $('#tag').change(function(event) {
        if ($(this).val().length > 6) {
          alert('You can only choose 6 tags!');
    $(this).val(last_valid_selection);
        } else {
          last_valid_selection = $(this).val();
        }
      });
    });
    
      
      
$(function(){
    $('form').submit(function(){
         var options = $('#tag > option:selected');
         if(options.length < 3){
             alert('Please select at least 3 tags');
             return false;
         };
    
      
    });
});
    
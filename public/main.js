jQuery(document).ready(function() {
  jQuery('#authors').on('click', function() {
    jQuery(".popup").fadeIn("fast", function() {
      jQuery('.popup').addClass('popup-active');
    });
  });
  
  jQuery('.btn-close, .bg').on('click', function() {
    jQuery(".popup").fadeOut("fast", function() {
      jQuery('.popup').removeClass('popup-active');
    });
  });
  
});

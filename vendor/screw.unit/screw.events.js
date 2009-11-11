(function($) {
  $(Screw)
    .bind('load', function() {    
      $('.describe, .it')
        .click(function() {
          document.location = location.href.split('?')[0] + '?' + $(this).fn('selector');
          return false;
        })
        .focus(function() {
          return $(this).addClass('focused');
        })
        .bind('scroll', function() {
          document.body.scrollTop = $(this).offset().top;
        });

      $('.it')
        .bind('enqueued', function() {
          $(this).addClass('enqueued');
        })
        .bind('running', function() {
          $(this).addClass('running');
        })
        .bind('passed', function() {
          $(this).addClass('passed');
        })
        .bind('failed', function(e, reason) {
          $(this).addClass('failed');
          $('<p class="error">')
            .text(reason.toString())
            .appendTo($(this));
        })
    })
    .bind('before', function() {
      $('.status').text('Running...');
    })
    .bind('after', function() {
      $('.status').fn('display')
    })
})(jQuery);
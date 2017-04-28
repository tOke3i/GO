
$("#menu-toggle").click(function(e) {
    e.preventDefault();

    $("#wrapper").toggleClass("toggled");
    if($('#wrapper').hasClass("toggled")){
        $(this).toggleClass('open');
    }else if(!$('#wrapper').hasClass("toggled")){
        // $("#wrapper").toggleClass("toggled");
        $(this).toggleClass('open');
    }

});
(function($) {
    var $window = $(window),
        $wrapper = $('#wrapper');

    $window.resize(function resize() {
        if ($window.width() < 768) {
            return $wrapper.removeClass('toggled');
        }
        $wrapper.addClass('toggled');
    }).trigger('resize');
})(jQuery);

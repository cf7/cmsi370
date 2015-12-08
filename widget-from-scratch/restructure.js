(function ($) {
    var dragTile;
    $.fn.restructure = function () {
        this.mousedown(function (event) {
            dragTile = $(event.target).clone();
            $("body").append(dragTile);
        });
    };
}(jQuery));
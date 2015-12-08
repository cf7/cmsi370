(function ($) {

    var dragTile;

    var dragHandler = function (event) {
        dragTile.offset({ 
            left: event.pageX - dragTile.deltaX, 
            top: event.pageY - dragTile.deltaY
        });
    };
    var dragCleanUp = function (event) {
        dragTile.remove();
        $("body").unbind("mousemove", dragHandler);
    };
    $.fn.restructure = function () {
        this.mousedown(function (event) {
            dragTile = $(event.target).clone();
            var startOffset = $(event.target).offset();
            dragTile.deltaX = event.pageX - startOffset.left;
            dragTile.deltaY = event.pageY - startOffset.top;
            dragTile.addClass("tile-being-dragged")
                    .offset({
                        left: event.pageX - dragTile.deltaX,
                        top: event.pageY - dragTile.deltaY
                    });

            $("body").append(dragTile);
            $("body").mousemove(dragHandler);

            dragTile.mouseup(dragCleanUp);
        });
    };
}(jQuery));
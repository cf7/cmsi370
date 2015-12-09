(function ($) {

    var dragTile;

    var dragHandler = function (event) {
        dragTile.offset({ 
            left: event.pageX - dragTile.deltaX, 
            top: event.pageY - dragTile.deltaY
        });
    };
    var dragCleanUp = function (event) {
        // if statement for placing tile
        dragTile.remove();
        $("body").unbind("mousemove", dragHandler);
    };
    var addAttributes = function () {
        $("div").each(function (index) { 
            $(this).addClass("tile");
        });
    }
    $.fn.restructure = function () {

        addAttributes();

        this.mousedown(function (event) {
            if ($(event.target).hasClass("tile")) {
                console.log("outside");
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
            }
        });
    };
}(jQuery));
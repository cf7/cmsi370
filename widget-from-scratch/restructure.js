(function ($) {

    var dragTile;

    var dragHandler = function (event) {
        // shift tiles to give preview of drop

        /**
        * Have surrounding tiles rearrange themselves to
        * preview tile drop
        */

        dragTile.offset({ 
            left: event.pageX - dragTile.deltaX, 
            top: event.pageY - dragTile.deltaY
        });
    };
    var dragCleanUp = function (event) {
        /**
        * if user decides not to drop, revert back to original positions
        */

        /**
        * if user decides to drop, removed tile classes from other divs
        * Use clone to place new div in drop location and delete original
        * tile
        */

        dragTile.remove();
        $("body").unbind("mousemove", dragHandler);
    };
    var addDivs = function () {
        $('div.col-sm-4').each(function (index) {
            var $col = $(this);
            $col.wrap("<div class='tile'></div>");
        });
    }
    $.fn.restructure = function () {

        addDivs();

        this.mousedown(function (event) {
            if ($(event.target).parent().hasClass("tile")) {
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
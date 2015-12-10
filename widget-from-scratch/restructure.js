(function ($) {

    var dragTile;

    var dragHandler = function (event) {
        // shift tiles to give preview of drop

        /**
        * Have surrounding tiles rearrange themselves to
        * preview tile drop
        * (maybe not)
        */

        dragTile.offset({ 
            left: event.pageX - dragTile.deltaX, 
            top: event.pageY - dragTile.deltaY
        });

       $("body").data("mouseCoordinates", { left: event.pageX, top: event.pageY });
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
        var mousePosition = $("body").data("mouseCoordinates");
        dragTile.hide();
        var $element = $(document.elementFromPoint(mousePosition.left, mousePosition.top));
        dragTile.show();
        console.log($element);
        if ($element.parent().hasClass("tile")) {
            $("#original").parent().attr("id", "sendingTile");
            $element.parent().attr("id", "receivingTile");
            $("#sendingTile").append($element);
            $("#receivingTile").append($("#original"));
            dragTile.remove();
            $(".tile").removeAttr("id");
            $("#original").removeAttr("id");
        }
        $("body").unbind("mousemove", dragHandler);
    };

    var move = function () {
        /**
        * 2 instances for moving: 1.) An empty space has opened, move to empty space
        * if it is this tile's turn
        * 2.) 
        */
    };


    // might not need this
    var hoverHandler = function (event) {
        console.log("hovering");
        /**
        * Dynamics of communicating with surrounding tiles and knowing when and
        * where to move.
        */
    };

    var addDivs = function () {
        // look into using selectors $("div[class|='col']").each( . . .)
        $(".row").children().each(function (index) {
            var $col = $(this);
            $col.wrap("<div class='tile'></div>");
        });
        $(".tile").each(function (index) {
            var $tile = $(this);
            $tile.mouseover(hoverHandler); // mouseover() or hover(), why different functions?
        });
    }

    $.fn.restructure = function () {
        addDivs();

        this.mousedown(function (event) {
            $(event.target).attr("id", "original");
            dragTile = $(event.target).parent().clone(true);
            if (dragTile.hasClass("tile")) {
                var startOffset = dragTile.offset();
                dragTile.deltaX = event.pageX - startOffset.left;
                dragTile.deltaY = event.pageY - startOffset.top;
                dragTile.offset({
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
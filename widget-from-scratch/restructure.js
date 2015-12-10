(function ($) {

    var dragTile;

    var dragHandler = function (event) {
        dragTile.offset({ 
            left: event.pageX - dragTile.deltaX, 
            top: event.pageY - dragTile.deltaY
        });

       $("body").data("mouseCoordinates", { left: event.pageX, top: event.pageY });
    };


    var dragCleanUp = function (event) {
        var mousePosition = $("body").data("mouseCoordinates");
        dragTile.hide();
        var $element = $(document.elementFromPoint(mousePosition.left, mousePosition.top)); //coudn't find jQuery equivalent
        console.log($element);
        if ($element.parent().hasClass("tile")) {
            $("#original").parent().attr("id", "sendingTile");
            $element.parent().attr("id", "receivingTile");
            $("#sendingTile").append($element);
            $("#receivingTile").append($("#original"));
            dragTile.remove();
            console.log("afterremove");
            $(".tile").removeAttr("id");
            $("#original").removeAttr("id");
        }
        $("body").unbind("mousemove", dragHandler);
    };


    // might not need this
    var hoverIn = function (event) {
        console.log("hoverIn");
        var $element = $(event.target);
        if ($element.parent().hasClass("tile")) {
            $element.css({ border: "5px solid blue" });
        }
    };

    var hoverOut = function (event) {
        var $element = $(event.target);
        if ($element.parent().hasClass("tile")) {
            $element.css({ border: "" });
        }
    };

    var addDivs = function () {
        $("div[class|='col']").each(function (index) {
            var $col = $(this);
            $col.wrap("<div class='tile'></div>");
        });
        $(".tile").each(function (index) {
            var $tile = $(this);
            $tile.hover(hoverIn, hoverOut);
        });
    };

    $.fn.restructure = function () {
        addDivs();

        /**
        * Add feedback for the user!!!!!!!!!!!!!!!!
        */

        this.mousedown(function (event) {
            $(event.target).attr("id", "original");
            if ($(event.target).parent().hasClass("tile")) {
                dragTile = $(event.target).clone();
                dragTile.attr("id", "tile-being-dragged");
                var startOffset = $(event.target).offset(); // do not use the offset of the clone!
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
(function ($) {

    /**
    * The goal of this plugin was to provide functionality that would allow users
    * to rearrange the layout of their interfaces. It accomplishes this by
    * wrapping existing html elements in the plugin's tiles that allow the plugin
    * to then identify and move html elements from tile to tile.
    */

    /**
    * Plugin may not swap tiles or highlight properly while the developer console is open
    */

    var dragTile;

    var dragHandler = function (event) {
        if ($(".underTile").length > 0) {
            $(".underTile").css({ border: "" })
                        .removeClass("underTile");
        }
        dragTile.offset({ 
            left: event.pageX - dragTile.deltaX, 
            top: event.pageY - dragTile.deltaY
        });
        $("body").data("mouseCoordinates", { left: event.pageX, top: event.pageY });
        var mousePosition = $("body").data("mouseCoordinates");
        dragTile.hide();
        var $element = $(document.elementFromPoint(mousePosition.left, mousePosition.top));
        dragTile.show();
        if ($element.is("div") && !$element.hasClass("row") && !$element.hasClass("container")) {
            $element.addClass("underTile");
            $(".underTile").css({ border: "5px dotted blue" }); // JD: 5
        }
    };


    var dragCleanUp = function (event) {
        if ($(".underTile").length > 0) {
            $(".underTile").css({ border: "" }) // JD: 5
                        .removeClass("underTile"); // JD: 4
        }
        var mousePosition = $("body").data("mouseCoordinates");
        dragTile.hide();
        var $element = $(document.elementFromPoint(mousePosition.left, mousePosition.top));
        if ($element.is("div") && $element.parent().is(".tile")) {
            $("#original").parent().attr("id", "sendingTile");
            $element.parent().attr("id", "receivingTile");
            $("#sendingTile").append($element);
            $("#receivingTile").append($("#original"));
            dragTile.remove();
            $(".tile, #original").removeAttr("id");
        } else {
            $(".tile, #original").removeAttr("id");
            dragTile.remove();
        }
        $("body").unbind("mousemove", dragHandler);
    };

    var hoverIn = function (event) {
        var $element = $(event.target);
        if ($element.parent().hasClass("tile")) {
            $element.css({ border: "5px solid blue" }); // JD: 5
        }
    };

    var hoverOut = function (event) {
        var $element = $(event.target);
        if ($element.parent().hasClass("tile")) {
            $element.css({ border: "" }); // JD: 5
        }
    };

    var addDivs = function () {
        $(".col-sm-4, .col-sm-6").each(function (index) { // JD: 3
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
        this.mousedown(function (event) {
            if ($(event.target).parent().hasClass("tile")) {
                $(event.target).attr("id", "original");
                dragTile = $(event.target).clone();
                dragTile.attr("id", "tile-being-dragged");
                var startOffset = $(event.target).offset();
                dragTile.deltaX = event.pageX - startOffset.left;
                dragTile.deltaY = event.pageY - startOffset.top;
                dragTile.offset({
                            left: event.pageX - dragTile.deltaX, // JD: 4
                            top: event.pageY - dragTile.deltaY
                        });
                $("body").append(dragTile)
                        .mousemove(dragHandler); // JD: 4
                dragTile.mouseup(dragCleanUp);
            }
        });
    };
}(jQuery));
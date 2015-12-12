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
            $(".underTile").css({ border: "" });
            $(".underTile").removeClass("underTile");
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
            $(".underTile").css({ border: "5px dotted blue" });
            console.log($(".underTile").offset());
            console.log("dragTileY: " + $("#tile-being-dragged").offset().top + " dragTileX: " + $("#tile-being-dragged").offset().left);
            console.log("mouseY: " + mousePosition.top + " mouseX: " + mousePosition.left );
        }
    };


    var dragCleanUp = function (event) {
        if ($(".underTile").length > 0) {
            $(".underTile").css({ border: "" });
            $(".underTile").removeClass("underTile");
        }
        var mousePosition = $("body").data("mouseCoordinates");
        dragTile.hide();
        var $element = $(document.elementFromPoint(mousePosition.left, mousePosition.top)); //coudn't find jQuery equivalent
        console.log($element);
        if ($element.is("div") && $element.parent().is(".tile")) {
            $("#original").parent().attr("id", "sendingTile");
            $element.parent().attr("id", "receivingTile");
            $("#sendingTile").append($element);
            $("#receivingTile").append($("#original"));
            dragTile.remove();
            $(".tile").removeAttr("id");
            $("#original").removeAttr("id");
        } else {
            $("#original").removeAttr("id");
            $(".tile").removeAttr("id");
            dragTile.remove();
        }
        $("body").unbind("mousemove", dragHandler);
    };

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
        $(".col-sm-4, .col-sm-6").each(function (index) {
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
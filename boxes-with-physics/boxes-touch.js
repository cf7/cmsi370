(function ($) {
    var movementsX = [];
    var movementsY = [];
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = $('#drawing-area').offset().left + $('#drawing-area').innerWidth();
    var bottomBorder = $('#drawing-area').offset().top + $('#drawing-area').innerHeight();
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                movementsX.push(touch.pageX - touch.target.deltaX);
                movementsY.push(touch.pageY - touch.target.deltaY);
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
            }
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    };

    /**
     * Concludes a drawing or moving sequence.
     */
    var endDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                var movingBox = touch.target.movingBox;
                var velocityX = movementsX[movementsX.length - 1] - movementsX[movementsX.length - 2];
                var velocityY = movementsY[movementsY.length - 1] - movementsY[movementsY.length - 2];
                var currentX = touch.pageX - touch.target.deltaX;
                var currentY = touch.pageY - touch.target.deltaY;
                var frictionX = -10;
                var frictionY = -10;
                $('#drawing-area').append('<p>' + "drawing area X " + $('#drawing-area').offset().left);
                $('#drawing-area').append('<p>' + "innerHeight " + $('#drawing-area').innerHeight());
                $('#drawing-area').append('<p>' + "X " + velocityX + " Y " + velocityY + '</p>');
                $("#drawing-area").append('<p>' + "index " + index + " id " + touch.identifier + '</p>');
                $("#drawing-area").append('<p>' + "dx" + touch.target.deltaX + "dy" + touch.target.deltaY + '</p>');
                //while (true) {
                    movingBox.offset({
                        left: currentX,
                        top: currentY
                    });
                //}
            }
        });
        movementsX = [];
        movementsY = [];
    };

    /**
     * Indicates that an element is unhighlighted.
     */
    var unhighlight = function () {
        $(this).removeClass("box-highlight");
    };

    /**
     * Begins a box move sequence.
     */
    var startMove = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    var setDrawingArea = function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchmove", trackDrag, false);
                element.addEventListener("touchend", endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", startMove, false);
                element.addEventListener("touchend", unhighlight, false);
            });
    };

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
    };
}(jQuery));
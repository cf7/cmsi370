// for some reason the code wasn't being called without this
$(function () {
    $("#drawing-area").boxesTouch();
});

(function ($) {
    // var movementsX = [];
    // var movementsY = [];
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = $('#drawing-area').offset().left + $('#drawing-area').innerWidth();
    var bottomBorder = $('#drawing-area').offset().top + $('#drawing-area').innerHeight();

    var withinBorders = function (leftSide, topSide, rightSide, bottomSide) {
        if (leftSide > leftBorder && rightSide < rightBorder) {
            if (topSide > topBorder && bottomSide < bottomBorder) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                // movementsX.push(touch.pageX - touch.target.deltaX);
                // movementsY.push(touch.pageY - touch.target.deltaY);
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
            }
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    };

    var log = function (text) {
        $('#console')
            .text(text)
            .scrollTop($('#console').prop("scrollHeight"));
    }

    /**
     * Concludes a drawing or moving sequence.
     */
    var endDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                log(index);

                touch.target.movingBox = null;
                // var movingBox = touch.target.movingBox;
                // var velocityX = movementsX[movementsX.length - 1] - movementsX[movementsX.length - 2];
                // var velocityY = movementsY[movementsY.length - 1] - movementsY[movementsY.length - 2];
                // var currentX = touch.pageX - touch.target.deltaX;
                // var currentY = touch.pageY - touch.target.deltaY;
                // var frictionX = -0.01;
                // var frictionY = -0.01;
                // while (withinBorders(currentX + velocityX, currentY + velocityY)) {
                //     log("inside");
                //     movingBox.offset({
                //         left: currentX + velocityX,
                //         top: currentY + velocityY
                //     });
                //     velocityX += frictionX;
                //     velocityY += frictionY;
                // }
            }
        });
        // movementsX = [];
        // movementsY = [];
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

    var lastTimestamp = 0;
    var updateBoxes = function (timestamp) {
        var delta = timestamp - lastTimestamp;
        if (delta > 100) {
            $("div.box").each(function (index) {
                var $box = $(this);
                var offset = $box.offset();
                var boxHeight = $box.innerHeight();
                var boxWidth = $box.innerWidth();
                if (withinBorders(offset.left, offset.top, 
                        offset.left + boxWidth, 
                        offset.top + boxHeight)) {
                    
                    var distance = 10.0 * delta / 1000;
                    offset.top += Math.floor(distance);

                    $box.offset(offset);
                }
                $("#timestamp").text(JSON.stringify(offset));
            });

            lastTimestamp = timestamp;
        }
        window.requestAnimationFrame(updateBoxes);
    };

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
        window.requestAnimationFrame(updateBoxes);
    };
}(jQuery));
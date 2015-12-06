(function ($) {
    var boxPositions = [];
    var lastTimestamp = 0;
    var lastPosition;
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = $('#drawing-area').offset().left + $('#drawing-area').innerWidth();
    var bottomBorder = $('#drawing-area').offset().top + $('#drawing-area').innerHeight();

    var log = function (text) {
        $('#drawing-area').append('<p>' + text + '</p>');
    }
    // var withinBorders = function (leftSide, topSide, rightSide, bottomSide) {
    //     if (leftSide > leftBorder && rightSide < rightBorder) {
    //         if (topSide > topBorder && bottomSide < bottomBorder) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
   
    var reverseDirections = function (element) {
        var leftSide = element.offset().left;
        var rightSide = element.offset().left + element.innerWidth();
        var topSide = element.offset().top;
        var bottomSide = element.offset().top + element.innerHeight();
        var nextLeftSide = leftSide + element.data("velX");
        var nextRightSide = rightSide + element.data("velX");
        var nextTopSide = topSide + element.data("velY");
        var nextBottomSide = bottomSide + element.data("velY");
        if (leftSide <= leftBorder || rightSide >= rightBorder) {
            element.data("velX", -element.data("velX"));
        }
        if (nextLeftSide <= leftBorder || nextRightSide >= rightBorder) {
            element.data("velX", -element.data("velX"));

        }
        if (topSide <= topBorder || bottomSide >= bottomBorder) {
           element.data("velY", -element.data("velY"));
        }
        if (nextTopSide <= topBorder || nextBottomSide >= bottomBorder) {
            element.data("velY", -element.data("velY"));
        }   

    }

    var setLastTimestamp = function (timestamp) {
        lastTimestamp = timestamp;
    }

    var flick = function (timestamp) {
            $("div.box").each(function (index) {
                var $box = $(this);
                if ($box.data("flicked")) {
                    if ($box.data("initial")) {
                        var dt = timestamp - lastTimestamp;
                        $box.data("velX", (lastPosition.left - boxPositions[boxPositions.length - 1].left) / dt);
                        $box.data("velY", (lastPosition.top - boxPositions[boxPositions.length - 1].top) / dt);
                        $box.data("initial", false);
                    }
                    reverseDirections($box);
                    var offset = $box.offset();
                    offset.left += $box.data("velX");
                    offset.top += $box.data("velY");
                    $box.offset(offset);
                }
            });
        lastTimestamp = timestamp;
        window.requestAnimationFrame(flick);
    }

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                boxPositions.push(touch.target.movingBox.offset());
                window.requestAnimationFrame(setLastTimestamp);
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
                lastPosition = touch.target.movingBox.offset();
                touch.target.movingBox
                    .data("flicked", true)
                    .data("initial", true);
                window.requestAnimationFrame(flick);                
            }
        });
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
            touch.target.movingBox
                .data("velX", 0)
                .data("velY", 0);
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

        $("div.box").each(function (index) {
            $(this).data({ 
                velX: 0.0,
                velY: 0.0,
                flicked: false,
                initial: false
            });
        });
    };

    // var updateBoxes = function (timestamp) {
    //     var delta = timestamp - lastTimestamp;
    //     if (delta > 100) {
    //         $("div.box").each(function (index) {
    //             var $box = $(this);
    //             var offset = $box.offset();
    //             var boxHeight = $box.innerHeight();
    //             var boxWidth = $box.innerWidth();
    //             if (withinBorders(offset.left, offset.top, 
    //                     offset.left + boxWidth, 
    //                     offset.top + boxHeight)) {
                    
    //                 var distance = 10.0 * delta / 1000;
    //                 offset.top += Math.floor(distance);

    //                 $box.offset(offset);
    //             }
    //             $("#timestamp").text(JSON.stringify(offset));
    //         });

    //         lastTimestamp = timestamp;
    //     }
    //     window.requestAnimationFrame(updateBoxes);
    // };

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
        //window.requestAnimationFrame(updateBoxes);
    };
}(jQuery));
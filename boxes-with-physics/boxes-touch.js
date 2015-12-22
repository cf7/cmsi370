(function ($) {
    var lastTimestamp = 0;
    var lastPosition;
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = leftBorder + $('#drawing-area').outerWidth(true);
    var bottomBorder = topBorder + $('#drawing-area').outerHeight(true);

    var reverseDirections = function () {
        $('div.box').each(function (index) {
            var $box = $(this);
            var velX = $box.data("velX");
            var velY = $box.data("velY");
            var boxOffset = $box.data("offset") || $box.offset(); // JD: 4
            var leftSide = boxOffset.left; // JD: 4
            var rightSide = leftSide + $box.outerWidth(true);
            var topSide = boxOffset.top; // JD: 4
            var bottomSide = topSide + $box.outerHeight(true);
            var nextLeftSide = leftSide + velX;
            var nextRightSide = rightSide + velX;
            var nextTopSide = topSide + velY;
            var nextBottomSide = bottomSide + velY;

            if (nextLeftSide < leftBorder) {
                $box.offset({ left: leftBorder + 5 })
                    .data("velX", -(velX * 0.5));
            }
            if (nextRightSide > rightBorder ) {
                $box.offset({ left: rightBorder - $box.outerWidth(true) - 5 })
                    .data("velX", -(velX * 0.5));
            }
            if (nextTopSide < topBorder) {
                $box.offset({ top: topBorder + 5 })
                    .data("velY", -(velY * 0.5));
            }    
            if (nextBottomSide > bottomBorder) {
                $box.offset({ top: bottomBorder - $box.outerHeight(true) - 5 })
                    .data("velY", -(velY * 0.5));
            }
        });
    }

    /**
    * With the implementation below, the boxes experience friction
    * and energy loss both in-air and when contacting a wall. 
    */
    var applyFriction = function () {
        $('div.box').each(function (index) {
            var $box = $(this);
            if ($box.data("flicked")) {
                var margin = 0.5;
                var velX = $box.data("velX");
                var velY = $box.data("velY");

                /**
                * Comment to turn off in-air friction.
                * It turns out that some of the bugs, such as the
                * sticking, are masked when in-air friction is turned on.
                * However, this does not get rid of the sticking problem
                * entirely.
                */
                if (velX > margin) { // JD: 3
                    $box.data("velX", velX - 0.01);
                }
                if (velX < -margin) {
                    $box.data("velX", velX + 0.01);
                }
                if (velY > margin) {
                    $box.data("velY", velY - 0.01);
                }
                if (velY < -margin) {
                    $box.data("velY", velY + 0.01);
                }

                // do not comment below this line

                if (Math.abs(velX) < margin) {
                    $box.data("velX", 0);
                }
                if (Math.abs(velY) < margin) {
                    $box.data("velY", 0);
                }
                if (velX === 0 || velY === 0) {
                    $box.data("flicked", false)
                        .data("gravity", true);
                }
            }
        });
    }

    var setLastTimestamp = function (timestamp) {
        lastTimestamp = timestamp;
    }

    var flick = function (timestamp) {
        var noneMoving = true;
        $("div.box").each(function (index) {
            var $box = $(this);
            if ($box.data("flicked")) {
                if ($box.data("initial")) {
                    var dt = timestamp - lastTimestamp;
                    if (dt === 0) {
                        dt = 0.1;
                    }
                    $box.data("velX", ((lastPosition.left - $box.data("previousPosition").left) * 10) / dt)
                        .data("velY", ((lastPosition.top - $box.data("previousPosition").top) * 10) / dt)
                        .data("initial", false);
                }
                reverseDirections();
                applyFriction();
                var offset = $box.data("offset") || $box.offset(); // JD: 4
                offset.left += $box.data("velX");
                offset.top += $box.data("velY");
                $box.offset(offset);
            }
        });
        lastTimestamp = timestamp;
        $('div.box').each(function (index) {
            if ($(this).data("flicked")) {
                noneMoving = false;
            }
        });
        if (!noneMoving) {
            window.requestAnimationFrame(flick);
        } else {
            return;
        }
    }

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                touch.target.movingBox.data("previousPosition", touch.target.movingBox.offset());
                window.requestAnimationFrame(setLastTimestamp);

                var newOffset = { // JD: 4
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                };
                touch.target.movingBox
                    .data("offset", newOffset)
                    .offset(newOffset);
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
                    .data("offset", null) // JD: 4
                    .data("flicked", true)
                    .data("initial", true);
                window.requestAnimationFrame(flick);
                touch.target.movingBox = null;
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
                .data("velY", 0)
                .data("offset", startOffset) // JD: 4
                .data("gravity", false);
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    var gravity = function (event) { // JD: 6
        var beta = event.beta;
        var gamma = event.gamma;
        var mass = 0.1;

        if (beta > 90) {
            beta = 90;
        }
        if (beta < -90) {
            beta = -90;
        }
        if (gamma > 90) {
            gamma = 90;
        }
        if (gamma < -90) {
            gamma = -90;
        }
        beta = beta * (Math.PI/180);
        gamma = gamma * (Math.PI/180);
        $('div.box').each(function (index) {
            var $box = $(this);
            if ($box.data("gravity")) {
                reverseDirections();
                $box.data("velY", $box.data("velY") + ((mass * 9.81) * (Math.sin(beta))))
                    .data("velX", $box.data("velX") + ((mass * 9.81) * (Math.sin(gamma))))
                    .offset({
                        left: $box.offset().left + $box.data("velX"),
                        top: $box.offset().top + $box.data("velY")
                    });
            }
        });
    }

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
                previousPosition: {},
                flicked: false,
                initial: false,
                gravity: true
            });
        });
    };

    $.fn.boxesTouch = function () {
        window.addEventListener("deviceorientation", gravity, true); // JD: 5
        setDrawingArea(this);
    };
}(jQuery));

// JD: 7
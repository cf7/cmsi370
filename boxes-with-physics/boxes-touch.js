(function ($) {
    var lastTimestamp = 0;
    var lastPosition;
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = leftBorder + $('#drawing-area').outerWidth();
    var bottomBorder = topBorder + $('#drawing-area').outerHeight();

    var reverseDirections = function () {
        $('div.box').each(function (index) {
            var $box = $(this);
            var velX = $box.data("velX");
            var velY = $box.data("velY");
            var leftSide = $box.offset().left;
            var rightSide = leftSide + $box.outerWidth();
            var topSide = $box.offset().top;
            var bottomSide = topSide + $box.outerHeight();
            var nextLeftSide = leftSide + velX;
            var nextRightSide = rightSide + velX;
            var nextTopSide = topSide + velY;
            var nextBottomSide = bottomSide + velY;
           
            if ($box.data("flicked")) {
                if (nextLeftSide <= leftBorder) {
                    $box.offset({ left: leftBorder + 5 });
                    $box.data("velX", -(velX - (0.5 * velX))); 
                    // suggested for me to Math.abs somewhere around here cuz otherwise velocity only increases
                    // I think this still works though because having (velX - (0.25 * velX)),
                    // if velX is negative, then the middle negative sign will flip the 2nd velX, which
                    // succesfully reduces the absolute velocity
                }
                if (nextRightSide > rightBorder ) {
                    $box.offset({ left: rightBorder - $box.outerWidth(true) - 5 });
                    $box.data("velX", -(velX - (0.5 * velX)));
                }
                if (nextTopSide < topBorder) {
                    $box.offset({ top: topBorder + 5 });
                    $box.data("velY", -(velY - (0.5 * velY)));
                }    
                if (nextBottomSide > bottomBorder) {
                    $box.offset({ top: bottomBorder - $box.outerHeight(true) - 5 });
                    $box.data("velY", -(velY - (0.5 * velY)));
                }
            }

            if ($box.data("gravity")) {
                if (nextLeftSide <= leftBorder || nextRightSide >= rightBorder) {
                    $box.offset({ left: $box.offset().left });
                    $box.data("velX", -(velX - (0.25 * velX))); 
                }
                if (nextTopSide <= topBorder || nextBottomSide >= bottomBorder) {
                    $box.offset({ top: $box.offset().top });
                    $box.data("velY", -(velY - (0.25 * velY)));
                }    
            }
        });
    }

    /**
    * With the implementation below, the boxes only experience friction
    * and energy loss when contacting a wall. To see air friction, uncomment
    * the block that is commented below.
    */
    var applyFriction = function () {
        $('div.box').each(function (index) {
            var $box = $(this);
            if ($box.data("flicked") && $box.data("friction")) {
                var margin = 0.1;
                var velX = $box.data("velX");
                var velY = $box.data("velY");

                /**
                * Uncomment for in-air friction
                */
                // if (velX > margin) {
                //     $box.data("velX", velX - 0.01);
                // } else if (velX < -margin) {
                //     $box.data("velX", velX + 0.01);
                // }
                // if (velY > margin) {
                //     $box.data("velY", velY - 0.01);
                // } else if (velY < -margin) {
                //     $box.data("velY", velY + 0.01);
                // }

                if (Math.abs(velX) < margin) {
                    $box.data("velX", 0);
                }
                if (Math.abs(velY) < margin) {
                    $box.data("velY", 0);
                }
                if (velX === 0 && velY === 0) {
                    $box.data("flicked", false)
                        .data("friction", false)
                        .data("gravity", true);
                }
            }
        });
    }

    var setLastTimestamp = function (timestamp) {
        lastTimestamp = timestamp;
    }

    var flick = function (timestamp) {
        //var noneMoving = true;
        $("div.box").each(function (index) {
            var $box = $(this);
            if ($box.data("flicked")) {
                if ($box.data("initial")) {
                    var dt = timestamp - lastTimestamp;
                    $box.data("velX", ((lastPosition.left - $box.data("previousPosition").left) * 10) / dt);
                    $box.data("velY", ((lastPosition.top - $box.data("previousPosition").top) * 10) / dt);
                    $box.data("initial", false);
                }
                reverseDirections();
                applyFriction();
                var offset = $box.offset();
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
            console.log("return from flick");
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
                    .data("initial", true)
                    .data("friction", true);
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
                .data("velY", 0)
                .data("initial", true)
                .data("gravity", false);
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    var gravity = function (event) {
        var alpha = event.aplha;
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
                $box.data("velY", $box.data("velY") + ((mass * 9.81) * (Math.sin(beta))));
                $box.data("velX", $box.data("velX") + ((mass * 9.81) * (Math.sin(gamma))));

                $box.offset({
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
                friction: false,
                gravity: true,
                pastPositionsX: [0,0],
                pastPositionsY: [0,0],
                pastTimes: [],
                outOfBounds: false
            });
        });
    };

    $.fn.boxesTouch = function () {
        window.addEventListener("deviceorientation", gravity, true);
        setDrawingArea(this);
    };
}(jQuery));
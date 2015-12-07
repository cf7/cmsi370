(function ($) {
    var lastTimestamp = 0;
    var lastPosition;
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = leftBorder + $('#drawing-area').innerWidth();
    var bottomBorder = topBorder + $('#drawing-area').innerHeight();

    var log = function (text) {
        //$('#console').text($('#console').text() + text);
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

    var reverseDirections = function () {
        $('div.box').each(function (index) {
            var $box = $(this);
            var leftSide = $box.offset().left;
            var rightSide = leftSide + $box.innerWidth();
            var topSide = $box.offset().top;
            var bottomSide = topSide + $box.innerHeight();
            var nextLeftSide = leftSide + $box.data("velX");
            var nextRightSide = rightSide + $box.data("velX");
            var nextTopSide = topSide + $box.data("velY");
            var nextBottomSide = bottomSide + $box.data("velY");
            var velX = $box.data("velX");
            var velY = $box.data("velY");
            if ($box.data("flicked")) {
                if (nextLeftSide <= leftBorder || nextRightSide >= rightBorder) {
                    $box.data("velX", -velX);
                }
                if (nextTopSide <= topBorder || nextBottomSide >= bottomBorder) {
                    $box.data("velY", -velX);
                }   
            }

            if (!$box.data("flicked") && $box.data("gravity")) {
                if (nextLeftSide <= leftBorder || nextRightSide >= rightBorder) {
                    $box.data("velX", -(velX - (0.25 * velX))); 
                }
                if (nextTopSide <= topBorder || nextBottomSide >= bottomBorder) {
                    $box.data("velY", -(velY - (0.25 * velY)));
                }    
            }
        });
    }

    // var applyFriction = function () {
    //     $('div.box').each(function (index) {
    //         var $box = $(this);
    //         if ($box.data("flicked") && $box.data("friction")) {
    //             var margin = 0.0001;
    //             var velX = $box.data("velX");
    //             var velY = $box.data("velY");

    //             if (velX > margin) {
    //                 $box.data("velX", velX - 0.01);
    //             } else if (velX < -margin) {
    //                 $box.data("velX", velX + 0.01);
    //             }
    //             if (velY > margin) {
    //                 $box.data("velY", velY - 0.01);
    //             } else if (velY < -margin) {
    //                 $box.data("velY", velY + 0.01);
    //             }

    //             if (Math.abs($box.data("velX")) < margin) {
    //                 log("inside");
    //                 $box.data("velX", 0)
    //                     .data("flicked", false)
    //                     //.data("friction", false)
    //                     .data("gravity", true);
    //             }
    //             if (Math.abs($box.data("velY")) < margin) {
    //                 log("insideY");
    //                 $box.data("velY", 0)
    //                     .data("flicked", false)
    //                     //.data("friction", false)
    //                     .data("gravity", true);
    //             }
    //         }
    //     });
    // }

    // var setLastTimestamp = function (timestamp) {
    //     lastTimestamp = timestamp;
    // }
    // var flick = function (timestamp) {
    //     var noneMoving = true;
    //         $("div.box").each(function (index) {
    //             var $box = $(this);
    //             if ($box.data("flicked")) {
    //                 if ($box.data("initial")) {
    //                     var dt = timestamp - lastTimestamp;
    //                     $box.data("velX", (lastPosition.left - $box.data("previousPosition").left) / dt);
    //                     $box.data("velY", (lastPosition.top - $box.data("previousPosition").top) / dt);
    //                     $box.data("initial", false);
    //                 }
    //                 reverseDirections();
    //                 applyFriction();
    //                 var offset = $box.offset();
    //                 offset.left += $box.data("velX");
    //                 offset.top += $box.data("velY");
    //                 $box.offset(offset);
    //             }
    //         });
    //     lastTimestamp = timestamp;
    //     $('div.box').each(function (index) {
    //         if ($(this).data("velX") != 0 || $(this).data("velY") != 0) {
    //             noneMoving = false;
    //         }
    //     });
    //     if (!noneMoving) {
    //         window.requestAnimationFrame(flick);
    //     } else {
    //         return;
    //     }
    // }

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                // touch.target.movingBox.data("previousPosition", touch.target.movingBox.offset());
                // window.requestAnimationFrame(setLastTimestamp);
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
                touch.target.movingBox = null;
                // lastPosition = touch.target.movingBox.offset();
                // touch.target.movingBox
                //     .data("flicked", true)
                //     .data("initial", true)
                //     .data("friction", true);
                // window.requestAnimationFrame(flick);                
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
                .data("previousPosition", {})
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
                flicked: false,
                initial: false,
                friction: false,
                gravity: true
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
        window.addEventListener("deviceorientation", gravity, true);
        setDrawingArea(this);
        //window.requestAnimationFrame(updateBoxes);
    };
}(jQuery));
(function ($) {

    // plugins have expectation of what it can be applied to
    // expect standard html structures

    var lastTimestamp = 0;
    var lastPosition;
    var leftBorder = $('#drawing-area').offset().left;
    var topBorder = $('#drawing-area').offset().top;
    var rightBorder = leftBorder + $('#drawing-area').innerWidth();
    var bottomBorder = topBorder + $('#drawing-area').innerHeight();

    var log = function (text) {
        $('#drawing-area').append('<p>' + text + '</p>');
    }

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
           
            // use current position instead of next position
            // hard code it to move back in
            if ($box.data("flicked")) {
                if (leftSide < leftBorder) {
                    $box.data("outOfBounds", true);
                    //while ($box.offset().left <= leftBorder) {
                        
                        $box.offset({ left: leftBorder + 5 });
                    //}
                    //$box.offset(nextLeftSide < leftBorder ? leftBorder : rightBorder, $box.offset().top);
                    $box.data("velX", -(velX - (0.5 * velX))); // Math.abs somewhere cuz otherwise velocity only increases
                    // I think this will still work because having (velX - (0.25 * velX)),
                    // if velX is negative, then the middle negative sign will flip the 2nd velX, which
                    // succesfully reduces the absolute velocity
                }
                if (rightSide > rightBorder ) {
                    $box.data("outOfBounds", true);
                    //while ($box.offset().left >= rightBorder) {
                        $box.offset({ left: rightBorder - $box.outerWidth(true) - 5 });
                    //}
                    $box.data("velX", -(velX - (0.5 * velX)));
                }
                if (topSide < topBorder) {
                    console.log(topBorder);
                    $box.data("outOfBounds", true);
                    //while ($box.offset().top <= topBorder) {
                        $box.offset({ top: topBorder + 5 });
                    //}
                    $box.data("velY", -(velY - (0.5 * velY)));
                }    
                if (bottomSide > bottomBorder) {
                    $box.data("outOfBounds", true);
                    //while ($box.offset().top >= bottomBorder) {
                        $box.offset({ top: bottomBorder - $box.outerHeight(true) - 5 });
                    //}
                    $box.data("velY", -(velY - (0.5 * velY)));
                }

                $box.data("outOfBounds", false);
            }

            if ($box.data("gravity")) {
                if (nextLeftSide <= leftBorder || nextRightSide >= rightBorder) {
                    $box.offset({ left: $box.offset().left }); // clamping works here though
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
            if ($box.data("flicked") && $box.data("friction") && !$box.data("outOfBounds")) {
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
                    console.log("inside");
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
        // $('div.box').each(function (index) {
        //     var $box = $(this);
        //     if ($box.data("flicked")) {
        //         var pastTimes = $(this).data("pastTimes");
        //         pastTimes[0] = timestamp;
        //         pastTimes.reverse();
        //         pastTimes.shift();
        //         pastTimes.reverse();
        //         $box.data("pastTimes", pastTimes);
        //     }
        // });
        lastTimestamp = timestamp;
    }

    // var incrementPositionData = function () {
    //     $('div.box').each(function (index) {
    //         var $box = $(this);
    //         if ($box.data("initial")) {
    //             var pastPositionsX = $box.data("pastPositionsX");
    //             var pastPositionsY = $box.data("pastPositionsY");
    //             var pastTimes = $box.data("pastTimes");

    //             if (pastPositionsX.length === 10) {
    //                 pastPositionsX.shift();
    //                 pastPositionsX[pastPositionsX.length - 1] = $box.offset().left;
    //             } else {
    //                 pastPositionsX[0] = $box.offset().left;
    //                 pastPositionsX.reverse();
    //                 pastPositionsX.shift();
    //                 pastPositionsX.reverse();
    //             }

    //             if (pastPositionsY.length === 10) {
    //                 pastPositionsY.shift();
    //                 pastPositionsY[pastPositionsY.length - 1] = $box.offset().top;
    //             } else {
    //                 pastPositionsY[0] = $box.offset().top;
    //                 pastPositionsY.reverse();
    //                 pastPositionsY.shift();
    //                 pastPositionsY.reverse();
    //             }

    //             if (pastTimes.length === 10) {
    //                 pastTimes.shift();
    //                 window.requestAnimationFrame(setLastTimestamp);
    //             } else {
    //                 window.requestAnimationFrame(setLastTimestamp);
    //             }
                
    //             $box.data("pastPositionsX", pastPositionsX);
    //             $box.data("pastPositionsY", pastPositionsY);
    //             $box.data("pastTimes", pastTimes);
    //         }
    //     });
    // }

    var sum = function (array) {
        var total = 0;
        for (i in array) {
            total += i;
        }
        return total;
    }

    var flick = function (timestamp) {
        var noneMoving = true;
        $("div.box").each(function (index) {
            var $box = $(this);
            if ($box.data("flicked")) {
                if ($box.data("initial")) {
                    // var pastPositionsX = $box.data("pastPositionsX");
                    // var pastPositionsY = $box.data("pastPositionsY");
                    // var avgXDist = sum(pastPositionsX) / pastPositionsX.length;
                    // log("avg x " + avgXDist);
                    // var avgYDist = sum(pastPositionsY) / pastPositionsY.length;
                    // var pastTimes = $box.data("pastTimes");
                    // log("time " + sum(pastTimes));
                    // var avgTime = sum(pastTimes) / pastTimes.length;
                    // $box.data("velX", avgXDist / avgTime);
                    // log($box.data("velX"));
                    // $box.data("velY", avgYDist / avgTime);
                
                    var dt = timestamp - lastTimestamp;
                    // if switching back to previous implementation, multiply velocities by 10
                    $box.data("velX", ((lastPosition.left - $box.data("previousPosition").left) * 10) / dt);
                    $box.data("velY", ((lastPosition.top - $box.data("previousPosition").top) * 10) / dt);
                   

                    $box.data("initial", false);
                }
                reverseDirections();
                applyFriction();
                if ($box.offset().left < 15 && $box.offset().top < 15) {
                    console.log("velX: " + $box.data("velX") + " velY: " + $box.data("velY"));
                    console.log("X : " + $box.offset().left + " Y: " + $box.offset().top);
                }
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
                // incrementPositionData();
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
    // take the average of all past velocities
    // by summing distance and dividing by avg distance  and summing total time
    // and dividing by avg time so far
    // initial velocity can then only be used to find direction of travel

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
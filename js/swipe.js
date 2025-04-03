// Page turning code using swiping gestures
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.swipe = function (aLeftCallback, aRightCallback) {
    var o = 0;

    window.addEventListener('touchstart', function (event) {
        // console.log('touchstart', event.targetTouches[0].screenX);
        o = event.targetTouches[0].screenX;
    }, true);

    window.addEventListener('touchend', function (event) {
        var dx = event.changedTouches[0].screenX - o;
        // console.log('touchend', event, 'dx', dx);
        if (dx > window.innerWidth / 3) {
            aLeftCallback();
        }
        if (dx < -window.innerWidth / 3) {
            aRightCallback();
        }
    }, true);
};

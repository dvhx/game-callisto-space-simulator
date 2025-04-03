// Autopilot that centers on target using pitch and yaw
"use strict";
// globals: document, window, setInterval, clearInterval, setTimeout

var SC = window.SC || {};

SC.cpy = (function () {
    var self = {}, interval, button, oldx, oldy;

    function onInterval() {
        // periodical update
        var x = SC.panel.lidar.rx / SC.time.speed,
            y = SC.panel.lidar.ry / SC.time.speed,
            dx = x - oldx,
            dy = y - oldy,
            tx = 0,
            ty = 0,
            r = Math.sqrt(x * x + y * y);
        if (r < 1) {
            //console.warn('cpy', x, y, 'dx', x - oldx, 'dy', y - oldy);
            // increase rotation in opposite direction (but when dot is moving to center accellerate it slower than when it is moving away)
            // x
            if (x > 0 && dx < 0) {
                tx = x / 9;
            }
            if (x > 0 && dx > 0) {
                tx = x;
            }
            if (x < 0 && dx > 0) {
                tx = x / 9;
            }
            if (x < 0 && dx < 0) {
                tx = x;
            }
            // y
            if (y > 0 && dy < 0) {
                ty = y / 9;
            }
            if (y > 0 && dy > 0) {
                ty = y;
            }
            if (y < 0 && dy > 0) {
                ty = y / 9;
            }
            if (y < 0 && dy < 0) {
                ty = y;
            }
            // impulse
            if (tx !== 0 || ty !== 0) {
                SC.panel.pan.state.x = tx;
                SC.panel.pan.state.y = ty;
                SC.panel.pan.update(SC.panel.pan.state, true);
                setTimeout(function () {
                    SC.panel.pan.state.x = 0;
                    SC.panel.pan.state.y = 0;
                    SC.panel.pan.update(SC.panel.pan.state, true);
                }, 500);
            }
        } else {
            SC.sound.say('Target is out of lidar range!');
            clearInterval(interval);
            button.light(false);
        }
        oldx = x;
        oldy = y;
    }

    self.onClick = function (aOn, aButton) {
        button = aButton;
        if (aOn) {
            // turn on
            console.log('cpy on');
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(onInterval, 1000);
            onInterval();
        } else {
            // turn off
            console.log('cpy off');
            clearInterval(interval);
        }
    };

    return self;
}());


// Autopilot centers target using thrusters, consumes fuel
"use strict";
// globals: document, window, setInterval, clearInterval, setTimeout

var SC = window.SC || {};

SC.ctr = (function () {
    var self = {}, interval, button, oldx, oldy;

    function onInterval() {
        // periodical update
        var x = SC.panel.lidar.rx,
            y = SC.panel.lidar.ry,
            dx = x - oldx,
            dy = y - oldy,
            tx = 0,
            ty = 0,
            r = Math.sqrt(x * x + y * y);
        //console.log('r', r.toFixed(2), 'xy', x.toFixed(2), y.toFixed(2));
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
            if (Math.abs(tx) > 0.05 || Math.abs(ty) > 0.05) {
                if (Math.abs(tx) > 0.3) {
                    tx *= 2;
                }
                if (Math.abs(ty) > 0.3) {
                    ty *= 2;
                }
                if (tx > 1) {
                    tx = 1;
                }
                if (tx < -1) {
                    tx = -1;
                }
                if (ty > 1) {
                    ty = 1;
                }
                if (ty < -1) {
                    ty = -1;
                }
                //console.log('tx', tx, 'ty', ty);
                SC.panel.thrust.state.x = tx;
                SC.panel.thrust.state.y = ty;
                SC.panel.thrust.update(SC.panel.thrust.state, true);
                setTimeout(function () {
                    SC.panel.thrust.state.x = 0;
                    SC.panel.thrust.state.y = 0;
                    SC.panel.thrust.update(SC.panel.thrust.state, true);
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
            console.log('ctr on');
            interval = setInterval(onInterval, 1000);
            onInterval();
        } else {
            // turn off
            console.log('ctr off');
            clearInterval(interval);
        }
    };

    return self;
}());


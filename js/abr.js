// Autobreaking using lidar distance
"use strict";
// globals: document, window, setInterval, clearInterval, setTimeout

var SC = window.SC || {};

SC.abr = (function () {
    var self = {}, interval, button;

    function onInterval() {
        // periodical update
        var d = SC.panel.lidar.distance,
            s = SC.panel.lidar.speed,
            t = 0;
        // find if we should break and how fast
        if (d > 10000 && d <= 20000 && s >= 50) {
            t = 1;
        }
        if (d > 5000 && d <= 10000 && s >= 30) {
            t = 1;
        }
        if (d > 1000 && d <= 5000 && s >= 20) {
            t = 1;
        }
        if (d > 500 && d <= 1000 && s >= 10) {
            t = 1;
        }
        if (d > 400 && d <= 500 && s >= 8) {
            t = 1;
        }
        if (d > 300 && d <= 400 && s >= 6) {
            t = 1;
        }
        if (d > 200 && d <= 300 && s >= 5) {
            t = 1;
        }
        if (d > 100 && d <= 200 && s >= 4) {
            t = 1;
        }
        if (d > 50 && d <= 100 && s >= 3) {
            t = 1;
        }
        if (d > 20 && d <= 50 && s >= 2) {
            t = 0.7;
        }
        if (d <= 20 && s >= 1) {
            t = 0.6;
        }
        if (d <= 15 && s >= 0) {
            t = 0.5;
        }
        // stop breaking
        if (s <= 0) {
            SC.sound.say('Autobreaking finished!');
            clearInterval(interval);
            button.light(false);
            return;
        }
        // pulse
        if (t !== 0) {
            SC.panel.fb.state.value = t;
            SC.panel.fb.update(SC.panel.fb.state, true);
            setTimeout(function () {
                SC.panel.fb.state.value = 0;
                SC.panel.fb.update(SC.panel.fb.state, true);
            }, 500);
        }
    }

    self.onClick = function (aOn, aButton) {
        button = aButton;
        if (aOn) {
            // turn on
            console.log('abr on');
            interval = setInterval(onInterval, 1000);
            onInterval();
        } else {
            // turn off
            console.log('abr off');
            clearInterval(interval);
        }
    };

    return self;
}());


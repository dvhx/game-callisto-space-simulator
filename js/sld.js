// Saying lidar distance
"use strict";
// globals: window, setInterval, clearInterval

var SC = window.SC || {};

SC.sayLidarDistance = (function () {
    // every minute say lidar distance
    var self = {}, interval;

    function onInterval() {
        // periodical update, say distance if needed
        if (!SC.panel.lidar || !SC.panel.lidar.state || !SC.panel.lidar.state.distance) {
            return;
        }
        var d = SC.panel.lidar.state.distance.toFixed(1);
        if (d) {
            SC.sound.sayMeters(d);
        }
    }

    self.onClick = function (aOn, aButton) {
        if (aOn) {
            // turn on
            // target must be on lidar
            if (!SC.panel.lidar.state.distance) {
                aButton.light(false);
                SC.sound.say('Target is out of lidar range!', true);
                return;
            }
            interval = setInterval(onInterval, 60000);
            onInterval();
        } else {
            // turn off
            clearInterval(interval);
            interval = null;
        }
    };

    return self;
}());



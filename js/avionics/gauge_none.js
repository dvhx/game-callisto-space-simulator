// No gauge, just 1 big hole and 4 small holes for screws
"use strict";
// globals: window

var SC = window.SC || {};

SC.gaugeNone = function (aParent, aCap) {
    // create gauge
    var self = SC.gauge(aParent);
    self.updateInterval = 13;
    self.bg = self.createCanvas();

    self.update = function (aState) {
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // redraw everything
        self.bg.clear();
        self.drawMissingGauge(self.bg, self.bg.square, !aCap);
        self.renderCount++;
    };
    self.render();

    return self;
};

// Gauge "fuel" displays amount of available fuel
"use strict";
// globals: window

var SC = window.SC || {};

SC.gaugeFuel = function (aParent) {
    var self = SC.gauge(aParent, 'bg,hands,fg');
    self.updateInterval = 3.0;

    // fuel state
    self.state = {
        fuel: 500,
        max: 500
    };

    self.update = function (aState, aForceRedraw) {
        // draw actual moving parts (clock hands)
        if (!self.enabled || self.hidden) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        if (self.broken) {
            aState = {
                fuel: 350,
                max: 500
            };
        }
        var cx = self.hands.square.cx, cy = self.hands.square.cy, s = self.hands.square.s,
            len, x, y, a;
        // arrow
        self.hands.clear();
        len = 0.28 * s;
        a = (((2 - 0.17) - 1.17) * (aState.fuel / aState.max) + 1.17) * Math.PI + Math.PI;
        x = len * Math.cos(a);
        y = len * Math.sin(a);
        self.hands.context.lineWidth = 0.025 * s;
        self.hands.context.strokeStyle = 'orange';
        self.hands.context.beginPath();
        self.hands.context.moveTo(cx, cy + 0.25 * s);
        self.hands.context.lineTo(cx - x, cy + 0.25 * s - y);
        self.hands.context.closePath();
        self.hands.context.stroke();
        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, k = 0.35, lab, rm, i;
        if (s < 0) {
            s = 0;
        }
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        // dial
        self.bg.clear();
        self.drawDial(self.bg.context, self.bg.square);
        // draw dark bottom half-circle cover in foreground, then glare
        self.fg.clear();
        self.fg.context.strokeStyle = 'white';
        self.fg.context.lineWidth = 1;
        self.fg.context.beginPath();
        self.fg.context.fillStyle = '#111';
        self.fg.context.arc(cx, cy, 0.425 * s, k * Math.PI + Math.PI / 2, (2 - k) * Math.PI + Math.PI / 2, true);
        self.fg.context.fill();
        self.fg.context.closePath();
        // black circle
        self.fg.context.arc(cx, cy + 0.25 * s, 0.15 * s, 0, 2 * Math.PI, true);
        self.fg.context.fill();
        // bolt
        self.drawBolt(self.fg.context, cx, cy + 0.25 * s, 0.05 * s, self.fg.context);
        // glare
        self.drawGlare(self.fg.context, self.fg.square);
        // radial marks
        rm = self.drawRadialMarks(self.bg.context, 5, cx, cy + 0.25 * s, 0.3 * s, 0.35 * s, 'white', 0.015 * s, [], 1.17 * Math.PI, (2 - 0.17) * Math.PI, true, true);
        // marks labels
        self.bg.context.font = 'bold ' + 0.07 * s + 'px sans-serif';
        self.bg.context.fillStyle = 'white';
        self.bg.context.textAlign = 'center';
        lab = ['E', '1/4', '1/2', '3/4', 'F'];
        for (i = 0; i < rm.length; i++) {
            self.bg.context.fillStyle = i === 0 ? '#f77' : 'white';
            self.bg.context.fillText(lab[i], rm[i].x2, rm[i].y2 - 0.03 * s);
        }
        self.bg.context.fillStyle = 'orange';
        self.bg.context.font = 'bold ' + 0.09 * s + 'px sans-serif';
        self.bg.context.fillText('Fuel', cx, cy - 0.25 * s);
        // hands
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    return self;
};

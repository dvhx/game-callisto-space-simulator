// Gauge "rotation" (shows relative roll, pitch, yaw)
"use strict";
// globals: window

var SC = window.SC || {};

SC.gaugeRotation = function (aParent) {
    var self = SC.gauge(aParent, 'bg,hands,fg');
    self.updateInterval = 0.1;

    self.state = {
        roll: 0,
        pitch: 0,
        yaw: 0
    };

    function limit(aValue, aLimit) {
        // limit value to certain range
        if (aValue > aLimit) {
            return aLimit;
        }
        if (aValue < -aLimit) {
            return -aLimit;
        }
        return aValue;
    }

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
                yaw: 0.09 * Math.random(),
                pitch: 0.1 + 0.05 * Math.random(),
                roll: 0.3 + 0.01 * Math.random()
            };
        }
        var lim = 0.2, cx = self.bg.square.cx, cy = self.bg.square.cy, s = self.bg.square.s;
        // limit speed of change
        self.state.roll += limit(aState.roll, lim);
        self.state.pitch += limit(aState.pitch, lim);
        self.state.yaw += limit(aState.yaw, lim);
        // draw hands
        self.hands.clear();
        self.drawHand(self.hands.context, cx, cy, self.state.yaw * Math.PI + Math.PI / 2, 0.15 * s, 0.04 * s, 'yellow');
        self.drawHand(self.hands.context, cx, cy, self.state.pitch * Math.PI + Math.PI / 2, 0.25 * s, 0.03 * s, 'pink');
        self.drawHand(self.hands.context, cx, cy, self.state.roll * Math.PI + Math.PI / 2, 0.35 * s, 0.02 * s, 'red');
        // remember new state - not because this is relative, not absolute
        //self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // standard gauge in background + glare in foreground
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        // render everything
        var cx = self.bg.square.cx, cy = self.bg.square.cy, s = self.bg.square.s, t;
        // gauge
        self.bg.clear();
        self.drawDial(self.bg.context, self.bg.square);
        t = 0.01 * s;
        self.drawRadialMarks(self.bg.context, 20, cx, cy, s * 0.18, s * 0.22, 'yellow', t);
        self.drawRadialMarks(self.bg.context, 20, cx, cy, s * 0.28, s * 0.32, 'pink', t);
        self.drawRadialMarks(self.bg.context, 20, cx, cy, s * 0.38, s * 0.42, 'red', t);
        // label
        self.bg.context.font = 'bold ' + 0.05 * s + 'px sans';
        self.bg.context.textAlign = "center";
        self.bg.context.textBaseline = "top";
        self.bg.context.fillStyle = 'red';
        self.bg.context.fillText('Roll', cx, cy - 0.37 * s);
        self.bg.context.fillStyle = 'pink';
        self.bg.context.fillText('Pitch', cx, cy - 0.27 * s);
        self.bg.context.fillStyle = 'yellow';
        self.bg.context.fillText('Yaw', cx, cy - 0.15 * s);
        self.bg.context.fillStyle = 'white';
        //self.bg.context.fillText('x20°', cx, cy + 0.08 * s);
        // glare
        self.fg.clear();
        self.drawGlare(self.fg.context, self.fg.square);
        // hands (zero state because update is relative not absolute)
        self.update({yaw: 0, pitch: 0, roll: 0}, true);
        self.renderCount++;
    };
    self.render();

    return self;
};

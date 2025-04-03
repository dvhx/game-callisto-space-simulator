// Gauge "compass" (points towards sun)
"use strict";
// globals: window, Plane, Line

var SC = window.SC || {};

SC.gaugeCompass = function (aParent) {
    var self = SC.gauge(aParent, 'bg,hands,fg');
    self.updateInterval = 0.1;

    self.state = {
        azimuth: 0
    };

    self.calculate = function (aPosition, aDir, aRight, aSun) {
        // calculate sun's azimuth in dir-right plane
        var a, up, s, C, c, u, v;
        // create plane
        a = Plane.create(aPosition, aDir, aRight);
        // up vector
        up = aDir.cross(aRight).toUnitVector();
        // create line from sun up
        s = Line.create(aSun, up);
        // find intersection of plane and sun-up line
        if (!a || !s) {
            return 0;
        }
        C = a.intersectionWith(s);
        // create vector from position to C
        if (!C) {
            return 0;
        }
        c = C.subtract(aPosition);
        // measure angles from c to dir and right
        u = aDir.angleFrom(c);
        v = aRight.angleFrom(c);
        // find correct quadrant
        if (v <= Math.PI / 2) {
            return -u;
        }
        return u;
    };

    self.update = function (aState, aForceRedraw) {
        // draw actual moving parts (clock hands)
        if (!self.enabled || self.hidden) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        var cx = self.bg.square.cx, cy = self.bg.square.cy, s = self.bg.square.s, t, x, y, len;

        self.hands.clear();
        self.hands.context.lineCap = 'round';

        if (self.broken) {
            aState = {
                azimuth: 123
            };
        }

        // math
        x = -Math.cos(aState.azimuth - Math.PI / 2);
        y = Math.sin(aState.azimuth - Math.PI / 2);
        len = s * 0.3;
        // white arrow
        t = 0.07 * s;
        self.hands.context.lineWidth = t;
        self.hands.context.strokeStyle = 'white';
        self.hands.context.beginPath();
        self.hands.context.moveTo(cx + len * x, cy + len * y);
        self.hands.context.lineTo(cx - len * x, cy - len * y);
        self.hands.context.shadowBlur = t;
        self.hands.context.shadowOffsetX = 0.5 * t;
        self.hands.context.shadowOffsetY = 0.5 * t;
        self.hands.context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        self.hands.context.stroke();
        self.hands.context.closePath();
        // red tip
        t = 0.03 * s;
        self.hands.context.strokeStyle = 'red';
        self.hands.context.lineWidth = t;
        self.hands.context.beginPath();
        self.hands.context.moveTo(cx, cy);
        self.hands.context.lineTo(cx + len * x, cy + len * y);
        self.hands.context.stroke();
        self.hands.context.closePath();
        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        var cx = self.bg.square.cx, cy = self.bg.square.cy, s = self.bg.square.s, t;
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        // gauge
        self.bg.clear();
        self.drawDial(self.bg.context, self.bg.square);
        t = 0.02 * cx;
        self.drawRadialMarks(self.bg.context, 36, cx, cy, s * 0.33, s * 0.4, 'white', t, [0, 9, 18, 27]);
        t = 0.005 * cx;
        self.drawRadialMarks(self.bg.context, 2 * 36, cx, cy, s * 0.35, s * 0.4, 'white', t, [0, 1, 17, 18, 19, 35, 36, 37, 53, 54, 55, 71]);
        // n
        self.bg.context.font = "bold " + 0.09 * s + "px sans-serif";
        self.bg.context.textAlign = "center";
        self.bg.context.textBaseline = "top";
        self.bg.context.fillStyle = "yellow";
        self.bg.context.fillText('N', cx, cy - 0.4 * s);
        // s
        self.bg.context.fillStyle = "#f77";
        self.bg.context.textBaseline = "bottom";
        self.bg.context.fillText('S', cx, cy + 0.41 * s);
        // w
        self.bg.context.textAlign = "left";
        self.bg.context.textBaseline = "middle";
        self.bg.context.fillText('W', cx - 0.4 * s, cy);
        // e
        self.bg.context.textAlign = "right";
        self.bg.context.fillText('E', cx + 0.4 * s, cy);
        // sun
        self.bg.context.font = 'bold ' + 0.12 * s + 'px sans-serif';
        self.bg.context.textBaseline = "bottom";
        self.bg.context.textAlign = "center";
        self.bg.context.fillStyle = "white";
        self.bg.context.fillText('Sun', cx, cy - 0.1 * s);
        // glare
        self.fg.clear();
        self.drawGlare(self.fg.context, self.fg.square);
        // hands
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    return self;
};

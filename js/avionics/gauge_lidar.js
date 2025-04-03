// Gauge "lidar" (narrow beam distance measuring tool, single target, looks like old green oscilloscope)
"use strict";
// globals: window, setTimeout

var SC = window.SC || {};

SC.gaugeLidar = function (aParent) {
    // create display
    var self = SC.gauge(aParent, 'bg,hands,extra,fg'), old_distance, extra_time = 0;
    self.updateInterval = 0.1;

    self.state = {
        x: 0,
        y: 0,
        distance: 0
    };

    self.speed = 0;
    self.distance = 0;
    self.eta = 0;
    self.outOfRange = false;
    self.sensitivity = 1;

    self.extraLabel = function (aText) {
        // Draw extra piece of text temporarily
        if (self.broken || !self.enabled || self.hidden) {
            return;
        }
        var s = self.hands.square.s;
        self.extra.clear();
        self.extra.context.fillStyle = 'lime';
        self.extra.context.font = (0.08 * s) + 'px Crystal';
        self.extra.context.textAlign = 'center';
        self.extra.context.fillText(aText, self.extra.square.cx, self.extra.square.cy - self.extra.square.s * 0.25);
        extra_time = Date.now();
    };

    // sensitivity knob
    self.knob = SC.knob(aParent, 'nut1');
    self.knob.place(self.bg.square);
    self.knob.min = 1;
    self.knob.max = 1000;
    self.knob.step = 2;
    self.knob.callback = function (aValue) {
        self.sensitivity = aValue;
        self.update(self.state, true);
        self.extraLabel(aValue + 'x');
    };

    self.update = function (aState, aForceRedraw) {
        // draw actual moving parts
        if (!self.enabled || self.hidden) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        if (self.broken) {
            aState = {
                x: 0,
                y: 0,
                distance: 1
            };
        }
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, x, y;

        // clear previous dot and label
        self.hands.clear();
        if (self.hidden) {
            return;
        }

        self.outOfRange = false;
        self.speed = -(aState.distance - old_distance) / (SC.time.s - self.updateTime);
        self.distance = aState.distance;
        old_distance = aState.distance;

        // clear extra label
        if ((extra_time > 0) && (Date.now() - extra_time > 3000)) {
            self.extra.clear();
            extra_time = 0;
        }

        // apply sensitivity
        x = aState.x * (s + 10 * self.sensitivity);
        y = aState.y * (s + 10 * self.sensitivity);
        self.rx = 2.5 * x / s;
        self.ry = 2.5 * y / s;

        // out of angle?
        if (Math.sqrt(x * x + y * y) > s * 0.4 || isNaN(self.state.x)) {
            self.distance = null;
            self.speed = null;
            self.eta = null;
            self.outOfRange = true;
            return false;
        }

        // out of range
        if (aState.distance > 1e30 || self.distance === undefined) {
            self.outOfRange = true;
            return false;
        }

        // draw dot
        self.hands.context.fillStyle = 'lime';
        self.hands.context.fillRect(cx + x - 2, cy + y - 2, 4, 4);

        // label
        self.hands.context.beginPath();
        self.hands.context.textAlign = "center";
        self.hands.context.textBaseline = "top";
        self.hands.context.font = (0.08 * s) + "px Crystal";
        self.hands.context.fillStyle = 'lime';
        // distance
        if (aState.distance > 10000000000) {
            self.hands.context.fillText(Math.ceil(aState.distance / 1000000) + 'M', cx, cy - 0.4 * s);
        } else if (aState.distance > 10000000) {
            self.hands.context.fillText(Math.ceil(aState.distance / 1000) + 'k', cx, cy - 0.4 * s);
        } else {
            self.hands.context.fillText(Math.ceil(aState.distance), cx, cy - 0.4 * s);
        }
        // speed
        self.hands.context.fillText((self.speed).toFixed(1), cx, cy + 0.32 * s);
        // eta
        if (Math.abs(self.speed) > 0.1) {
            self.eta = SC.hhmmss(aState.distance / self.speed);
            self.hands.context.fillText(self.eta, cx, cy + 0.22 * s);
        }
        self.hands.context.closePath();

        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
        return true;
    };

    function drawGrid(aCanvas, cx, cy, s, lc) {
        // Draw green square grid
        var i, w, n = 0, radius = 0.42 * s, step = 0.42 * s / lc, x, y;
        cx = Math.round(cx);
        cy = Math.round(cy);
        for (i = 0; i < radius; i += step) {
            n++;
            w = 1;
            aCanvas.context.globalAlpha = n % 5 === 1 ? 0.2 : 0.05;
            // vertical grid lines
            x = Math.round(i) + 0.5;
            y = Math.round(Math.sqrt(radius * radius - x * x)) + 0.5;
            aCanvas.line(cx + x, cy - y, cx + x, cy + y, 'lime', w);
            if (i > 0) {
                aCanvas.line(cx - x, cy - y, cx - x, cy + y, 'lime', w);
            }
            // horizontal grid lines
            aCanvas.line(cx - y, cy + x, cx + y, cy + x, 'lime', w);
            if (i > 0) {
                aCanvas.line(cx - y, cy - x, cx + y, cy - x, 'lime', w);
            }
        }
        aCanvas.context.globalAlpha = 1;
    }

    self.render = function () {
        // render everything
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s;
        // dial
        self.bg.clear();
        self.drawDial(self.bg.context, self.bg.square);
        // glare
        self.fg.clear();
        self.drawGlare(self.fg.context, self.fg.square);
        // green grid
        drawGrid(self.fg, cx, cy, s, 20);
        // update knob
        self.knob.place(self.bg.square);
        // value
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    self.hideOrig = self.hide;
    self.hide = function (aHidden) {
        // hide and also knob
        self.hideOrig(aHidden);
        self.knob.div.style.display = aHidden ? 'none' : '';
    };

    // mouse support (cannot use normal mouse support because knob is not container and don't have abs)
    self.container.addEventListener('mousedown', function (event) {
        self.mouse = event.clientX;
    }, true);
    self.container.addEventListener('mousemove', function (event) {
        if (event.which === 1 && self.mouse) {
            var dx = event.clientX - self.mouse;
            if (dx > 1) {
                self.sensitivity += 1;
                if (self.sensitivity > 1000) {
                    self.sensitivity = 1000;
                }
                self.update(self.state, true);
                self.extraLabel(self.sensitivity + 'x');
            }
            if (dx < -1) {
                self.sensitivity -= 1;
                if (self.sensitivity < 0) {
                    self.sensitivity = 0;
                }
                self.update(self.state, true);
                self.extraLabel(self.sensitivity + 'x');
            }
            self.mouse = event.clientX;
        }
    }, true);
    window.addEventListener('mouseup', function () {
        self.mouse = null;
    }, true);

    return self;
};


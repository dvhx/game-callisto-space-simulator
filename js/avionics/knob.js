// Simple radial knob
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.knob = function (aParent, aPlace) {
    var self = {}, div, dot, tx, ty, oldValue, non_linear_step = 1, non_linear_dir, non_linear_time = Date.now();
    self.parent = typeof aParent === 'string' ? document.getElementById(aParent) : aParent;
    if (!self.parent) {
        throw "Gauge parent not found: " + aParent;
    }
    if (self.parent.firstChild) {
        self.parentContainer = self.parent.firstChild;
    } else {
        self.parentContainer = self.parent;
    }
    self.value = 0;
    self.min = 0;
    self.max = 100;
    self.step = 1;
    self.callback = null;

    // knob
    div = document.createElement('div');
    div.className = 'knob';
    self.div = div;
    // dot
    dot = document.createElement('div');
    div.appendChild(dot);
    self.dot = dot;
    self.parentContainer.appendChild(div);

    self.update = function (aValue) {
        // update value
        self.value = aValue;
        if (self.value > self.max) {
            self.value = self.max;
        }
        if (self.value < self.min) {
            self.value = self.min;
        }
        dot.style.transform = 'rotate(' + (self.value * 2.7 - 220) + 'deg)';
        if (self.value !== oldValue) {
            oldValue = self.value;
            if (self.callback) {
                self.callback(self.value, aParent, aPlace);
            }
        }
    };

    function wheel(aDelta) {
        // move knob in delta direction by step
        var n = Date.now(),
            dir = aDelta > 0 ? self.step : -self.step,
            same_dir = non_linear_dir / dir > 0;
        non_linear_dir = dir;
        if (Math.abs(aDelta) < 5) {
            non_linear_step = 1;
        }
        if (n - non_linear_time < 100) {
            if (same_dir) {
                non_linear_step += 5;
                dir = aDelta > 0 ? non_linear_step : -non_linear_step;
            } else {
                non_linear_step = 1;
            }
        } else {
            non_linear_step = 1;
        }
        non_linear_time = n;
        self.update(self.value + dir);
    }

    // turning by wheel
    div.addEventListener('wheel', function (event) {
        wheel(event.wheelDelta);
    });
    // turning by touch
    div.addEventListener('touchstart', function (event) {
        tx = event.targetTouches[0].clientX;
        ty = event.targetTouches[0].clientY;
        console.log(tx, ty);
    });
    div.addEventListener('touchmove', function (event) {
        var x = event.targetTouches[0].clientX,
            y = event.targetTouches[0].clientY,
            dx = x - tx,
            dy = y - ty,
            d = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
        wheel(d);
        tx = x;
        ty = y;
    });

    // first update
    self.update(self.value);

    self.place = function (aSquare) {
        // Place knob on gauge's square nut (nut1-nut4)
        //console.log('squareNut', aSquare);
        var x, y, s = 0.2 * aSquare.s, s2 = s / 2;
        div.style.position = 'absolute';
        div.style.width = s + 'px';
        div.style.height = s + 'px';
        switch (aPlace) {
        case 'nut1':
            x = aSquare.x + 0.1 * aSquare.w;
            y = aSquare.y + 0.1 * aSquare.h;
            div.style.left = 'calc(' + x + 'px - ' + s2 + 'px)';
            div.style.top = 'calc(' + y + 'px - ' + s2 + 'px)';
            break;
        case 'nut2':
            x = aSquare.x + 0.9 * aSquare.w;
            y = aSquare.y + 0.1 * aSquare.h;
            div.style.left = 'calc(' + x + 'px - ' + s2 + 'px)';
            div.style.top = 'calc(' + y + 'px - ' + s2 + 'px)';
            break;
        case 'nut3':
            x = aSquare.x + 0.9 * aSquare.w;
            y = aSquare.y + 0.9 * aSquare.h;
            div.style.left = 'calc(' + x + 'px - ' + s2 + 'px)';
            div.style.top = 'calc(' + y + 'px - ' + s2 + 'px)';
            break;
        case 'nut4':
            x = aSquare.x + 0.1 * aSquare.w;
            y = aSquare.y + 0.9 * aSquare.h;
            div.style.left = 'calc(' + x + 'px - ' + s2 + 'px)';
            div.style.top = 'calc(' + y + 'px - ' + s2 + 'px)';
            break;
        default:
            throw "unsupported knob place";
        }
    };

    return self;
};


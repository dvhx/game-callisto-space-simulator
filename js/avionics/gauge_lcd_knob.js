// Label, multi-digit 7-segment LCD display and knob
"use strict";
// globals: window, document, setTimeout

var SC = window.SC || {};

SC.gaugeLcdKnob = function (aParent, aLabel, aDigits, aValue, aMin, aMax, aCallback) {
    var self = SC.gauge(aParent, 'bg,fg'),
        delta = 0,
        zero = '000000000000000'.substr(0, aDigits || 2),
        zero_x,
        lcd_x,
        lcd_w,
        knob_x,
        knob_y,
        knob_r,
        knob_s,
        tx,
        ty,
        mx,
        non_linear_dir,
        non_linear_time = Date.now(),
        non_linear_step = 1;
    self.updateInterval = 1.0;
    self.callback2 = undefined; // sorry, delivery is more important than purity (used in displayDigits)

    self.state = {
        enabled: true,
        label: aLabel,
        digits: aDigits,
        value: aValue,
        valueLabels: null,
        valueLabel: null,
        step: 1,
        min: aMin,
        max: aMax
    };

    self.updateValue = function (aValue) {
        // update only value
        self.state.value = aValue;
        self.update(self.state, true);
    };

    self.update = function (aState, aForceRedraw) {
        // draw actual moving parts
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        var a;
        // value constraints
        if (aState.value < aState.min) {
            aState.value = aState.min;
        }
        if (aState.value > aState.max) {
            aState.value = aState.max;
        }
        // draw value
        self.fg.clear();
        if (aState.enabled) {
            self.fg.context.shadowBlur = 12;
            if (aState.valueLabels && aState.valueLabels.hasOwnProperty(aState.value)) {
                aState.valueLabel = aState.valueLabels[aState.value];
                self.fg.context.fillText(('                      ' + aState.valueLabel).substr(-(aDigits || 2)), zero_x, self.fg.h / 2);
            } else {
                aState.valueLabel = undefined;
                self.fg.context.fillText(('                      ' + aState.value.toFixed(0)).substr(-(aDigits || 2)), zero_x, self.fg.h / 2);
            }
        }
        // knob dot
        if (aCallback) {
            self.fg.context.shadowBlur = 0;
            self.fg.context.strokeStyle = 'white';
            self.fg.context.lineWidth = 2;
            self.fg.context.beginPath();
            if (aMax - aMin <= 628) {
                a = -1.7 * Math.PI * (aState.value - aMin) / aMax;
            } else {
                a = -0.01 * aState.value;
            }
            self.fg.context.arc(knob_x + 0.6 * knob_r * Math.sin(a), knob_y + 0.6 * knob_r * Math.cos(a), 0.1 * knob_r, 0, 2 * Math.PI);
            self.fg.context.stroke();
        }
        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        self.bg.clear();
        // label
        self.bg.context.font = 0.4 * self.bg.h + 'px sans-serif';
        self.bg.context.fillStyle = 'white';
        var l = aLabel.split(';'),
            n,
            lw = Math.max(self.bg.context.measureText(l[0]).width, self.bg.context.measureText(l[1] || '').width),
            lcd_font_height;
        knob_s = 0.9 * self.bg.h;
        if (self.bg.h > self.bg.w / 5) {
            knob_s = self.bg.w / 5;
        }
        knob_x = self.bg.w - knob_s / 2;
        knob_y = self.bg.h / 2;
        knob_r = knob_s / 2;
        if (lw < self.bg.h) {
            lw = self.bg.h;
        }
        self.bg.context.textAlign = 'center';
        if (l.length === 1) {
            self.bg.context.textBaseline = 'center';
            self.bg.context.fillText(l[0], lw / 2, self.bg.h / 2);
        }
        if (l.length === 2) {
            self.bg.context.textBaseline = 'bottom';
            self.bg.context.fillText(l[0], lw / 2, self.bg.h / 2);
            self.bg.context.textBaseline = 'top';
            self.bg.context.fillText(l[1], lw / 2, self.bg.h / 2);
        }
        // knob
        if (aCallback) {
            self.drawHole(self.bg.context, self.bg.w - knob_s / 2 - 1, self.bg.h / 2, knob_r - 1);
            self.drawKnob(self.bg.context, knob_x, knob_y, 0.8 * knob_r, 'gray');
        }
        // lcd (find largest possible font)
        self.bg.context.font = self.bg.h + 'px Crystal';
        lcd_font_height = 0.8 * self.bg.h;
        self.bg.context.font = lcd_font_height + 'px Crystal';
        lcd_w = self.bg.context.measureText(zero).width;
        n = 0;
        while (lcd_w > self.bg.w - lw - knob_s) {
            lcd_font_height *= 0.8;
            self.bg.context.font = lcd_font_height + 'px Crystal';
            lcd_w = self.bg.context.measureText(zero).width;
            n++;
            if (n > 50) {
                //console.log('n50', self.bg.h, zero, 'lcd_w', lcd_w, 'bw', self.bg.w, 'lw', lw, 'knob_s', knob_s, 'lfh', lcd_font_height, 's', self);
                break;
            }
        }
        lcd_x = self.bg.w - knob_s - lcd_w - 1;
        self.bg.context.fillStyle = 'black';
        //self.drawHole(self.bg.context, lcd_x + lcd_w / 2 - 1, 0, lcd_w / 2 + 2, self.bg.h - 1);
        //self.bg.context.fillRect(lcd_x, 0, lcd_w, self.bg.h);
        // zeroes
        self.bg.context.font = lcd_font_height + 'px Crystal';
        zero_x = lcd_x + (lcd_w - self.bg.context.measureText(zero).width) / 2;
        self.bg.context.fillStyle = '#020';
        self.bg.context.textAlign = 'left';
        self.bg.context.textBaseline = 'middle';
        self.bg.context.fillText(zero, zero_x, self.bg.h / 2);
        // values
        self.fg.context.font = lcd_font_height + 'px Crystal';
        self.fg.context.fillStyle = 'lime';
        self.fg.context.textAlign = 'left';
        self.fg.context.textBaseline = 'middle';
        self.fg.context.shadowColor = 'lime';
        self.update(self.state, true);
        self.renderCount++;
    };

    function wheel(aDelta) {
        // change value by self.step in delta direction, non-linear on fast changes
        var n = Date.now(),
            dir = aDelta > 0 ? self.state.step : -self.state.step,
            same_dir = non_linear_dir / dir > 0;
        non_linear_dir = dir;
        if (Math.abs(aDelta) < 5) {
            non_linear_step = 1;
        }
        if (n - non_linear_time < 50) {
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
        self.state.value += dir;
        self.update(self.state, true);
        if (aCallback) {
            aCallback(self.state);
        }
        if (self.callback2) {
            self.callback2(self.state);
        }
    }

    if (aCallback) {
        // by wheel
        self.fg.canvas.addEventListener('wheel', function (event) {
            event.preventDefault();
            wheel(event.wheelDelta);
        }, true);
        // by touch
        self.fg.canvas.addEventListener('touchstart', function (event) {
            tx = event.targetTouches[0].clientX;
            ty = event.targetTouches[0].clientY;
        });
        self.fg.canvas.addEventListener('touchmove', function (event) {
            var x = event.targetTouches[0].clientX,
                y = event.targetTouches[0].clientY,
                dx = x - tx,
                dy = y - ty,
                d = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
            delta += d;
            if (Math.abs(delta) > 15) {
                wheel(delta);
                delta = 0;
            }
            tx = x;
            ty = y;
        });
        // by mouse
        self.onMouseDown = function (event) {
            if (event.which === 1) {
                mx = event.clientX;
            }
        };
        self.onMouseMove = function (event) {
            if (event.which === 1 && Math.abs(event.clientX - mx) > 10) {
                wheel(event.clientX - mx > 0 ? 1 : event.clientX - mx < 0 ? -1 : 0);
                mx = event.clientX;
            }
        };
        self.onMouseUp = function () {
            mx = null;
        };
        SC.mouse.register(self);
    }

    self.render();

    self.hideOrig = self.hide;
    self.hide = function (aHidden) {
        if (aHidden) {
            self.container.style.visibility = 'hidden';
        } else {
            self.container.style.visibility = '';
        }
    };

    return self;
};

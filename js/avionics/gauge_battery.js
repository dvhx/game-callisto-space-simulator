// Gauge for displaying voltage and current of a battery
"use strict";
// globals: window

var SC = window.SC || {};

SC.gaugeBattery = function (aParent) {
    var self = SC.gauge(aParent, 'bg,hands,fg');
    self.updateInterval = 1.0;

    self.state = {
        voltage: 0,
        current: 0
    };

    function drawHand(aMarks, aValue, aColor) {
        // draw one bar
        var v;
        v = aValue > 0 ? aValue : 0;
        v = v < aMarks.max ? v : aMarks.max;
        v = aMarks.bottom - (aMarks.bottom - aMarks.top) * v / aMarks.max;
        self.hands.line(aMarks.left - 2 + 1, v + 2, aMarks.right - 2 + 1, v + 2, 'rgba(0,0,0,0.5)', 2);
        self.hands.line(aMarks.left - 2, v, aMarks.right - 2, v, aColor || 'red', 2);
    }

    self.update = function (aState, aForceRedraw) {
        // draw hands
        if (!self.enabled || self.hidden) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        // clear
        self.hands.clear();
        if (self.broken) {
            return;
        }
        // capacity
        drawHand(self.marks1, 24, 'cyan');
        drawHand(self.marks2, 30, 'cyan');
        // values
        drawHand(self.marks1, aState.voltage, 'red');
        drawHand(self.marks2, aState.current, 'red');
        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    function drawVerticalMarks(aCanvas, aX, aY, aW, aH, aColor, aWidth, aTics, aValues) {
        // draw vertical marks, e.g. for voltmeter
        var i, ax = aX + 3, ay = aY + 0.05 * aCanvas.h, bx = aX + aW - 0.1 * aCanvas.h, by = aY + aH - 0.05 * aCanvas.h, h = by - ay, s, y, v = 0;
        aCanvas.context.font = 0.05 * aCanvas.h + 'px monospace';
        aCanvas.context.fillStyle = aColor;
        aCanvas.context.lineWidth = aWidth;
        aCanvas.context.textAlign = 'right';
        aCanvas.context.textBaseline = 'middle';
        for (i = 0; i < aTics; i++) {
            y = Math.round(ay + i * h / (aTics - 1)) + 0.5;
            s = i % (aValues.length - 1) === 0 ? 2 : 10;
            if (i % (aValues.length - 1) === 0) {
                aCanvas.context.fillText(aValues[aValues.length - v - 1], aX + aW - 2, y);
                v++;
            }
            aCanvas.line(ax, y, bx - s, y, aColor, 1);
        }
        // return information needed for rendering of red bar
        return { max: aValues[aValues.length - 1], left: ax, right: bx, top: ay, bottom: by };
    }

    self.render = function () {
        // render everything
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        // main bevel
        self.bg.clear();
        self.bg.context.fillStyle = 'white';
        self.bevel(self.bg.context, 2, 2, self.bg.w - 4, self.bg.h - 4);
        // gauge bevels
        self.rect1 = { x: 6, y: 16, w: self.bg.w / 2 - 6 - 4, h: self.bg.h - 22 };
        self.rect2 = { x: self.bg.w / 2 + 2, y: 16, w: self.bg.w / 2 - 6 - 4, h: self.bg.h - 22 };
        self.bevel(self.bg.context, self.rect1.x, self.rect1.y, self.rect1.x + self.rect1.w, self.rect1.y + self.rect1.h, 1, true);
        self.bevel(self.bg.context, self.rect2.x, self.rect2.y, self.rect2.x + self.rect2.w, self.rect2.y + self.rect2.h, 1, true);
        // labels
        self.bg.context.font = "Bold " + self.rect1.y * 0.5 + "px sans-serif";
        self.bg.context.fillStyle = '#aaa';
        self.bg.context.save();
        self.bg.context.textAlign = 'center';
        self.bg.context.textBaseline = 'bottom';
        if (self.bg.context.measureText('VOLTAGE').width > self.rect1.w) {
            self.bg.context.fillText('V', self.rect1.x + self.rect1.w / 2, self.rect1.y - 4);
            self.bg.context.fillText('A', self.rect2.x + self.rect2.w / 2, self.rect2.y - 4);
        } else {
            self.bg.context.fillText('VOLTAGE', self.rect1.x + self.rect1.w / 2, self.rect1.y - 4);
            self.bg.context.fillText('CURRENT', self.rect2.x + self.rect2.w / 2, self.rect2.y - 4);
        }
        /*
        self.bg.context.textBaseline = 'top';
        self.bg.context.fillText('V', self.rect1.x + self.rect1.w / 2, self.rect1.y + self.rect1.h + 3);
        self.bg.context.fillText('A', self.rect2.x + self.rect2.w / 2, self.rect2.y + self.rect2.h + 3);
        */
        self.bg.context.restore();
        // glare
        self.fg.clear();
        self.drawGlare(self.fg.context, self.fg.square, function () {
            self.fg.context.fillRect(self.rect1.x, self.rect1.y, self.rect1.w, self.rect1.h);
            self.fg.context.fillRect(self.rect2.x, self.rect2.y, self.rect2.w, self.rect2.h);
        });
        // vertical marks
        self.marks1 = drawVerticalMarks(self.bg, self.rect1.x, self.rect1.y, self.rect1.w, self.rect1.h, '#aaa', 1, 10, [0, 10, 20, 30]);
        self.marks2 = drawVerticalMarks(self.bg, self.rect2.x, self.rect2.y, self.rect2.w, self.rect2.h, '#aaa', 1, 10, [0, 10, 20, 30]);
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    return self;
};

// Gauge "clock" (displays game time, not real time)
"use strict";
// globals: window

var SC = window.SC || {};

SC.gaugeClock = function (aParent) {
    var self = SC.gauge(aParent, 'bg,days,hands,knobs,fg'), oldDays, oldAmPm;
    self.updateInterval = 1.0;
    self.editable = false;

    self.state = {
        time: 0
    };

    self.update = function (aState, aForceRedraw) {
        // draw actual moving parts (clock hands)
        if (!self.enabled || self.hidden) {
            return;
        }
        var t, sec, min, hrs, days, ampm, cx = self.bg.square.cx, cy = self.bg.square.cy, s = self.bg.square.s, ht = 0.05 * cx;
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        // clear
        self.hands.clear();
        if (self.broken) {
            aState = {
                time: 1234
            };
        }
        // split time to HH:MM:SS and days
        t = Math.floor(aState.time);
        sec = t % 60;
        t -= sec;
        min = Math.floor(t / 60) % 60;
        t -= min * 60;
        hrs = Math.floor(t / 60 / 60) % 24;
        days = Math.floor(aState.time / 86400);
        ampm = hrs >= 12 ? "PM" : "AM";

        if (aForceRedraw || days !== oldDays || ampm !== oldAmPm) {
            self.days.clear();
            // days
            self.days.context.font = 'bold ' + 0.06 * s + 'px sans-serif';
            self.days.context.textBaseline = "top";
            self.days.context.textAlign = "center";
            self.days.context.fillStyle = "white";
            self.days.context.fillText(('00000' + days).substr(-5), cx, self.dayHoleY + 0.02 * s);
            oldDays = days;
            // am/pm
            self.days.context.fillText(ampm, cx, self.amHoleY + 0.02 * s);
            oldAmPm = ampm;
        }

        // hands
        self.drawHand(self.hands.context, cx, cy, (hrs + min / 60 + sec / 3600) * 2 * Math.PI / 12, 0.2 * s, ht, 'white');
        self.drawHand(self.hands.context, cx, cy, (min + sec / 60) * 2 * Math.PI / 60, 0.35 * s, ht, 'white');
        self.drawHand(self.hands.context, cx, cy, sec * 2 * Math.PI / 60, 0.35 * s, ht, '#e33');

        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.drawKnobs = function () {
        // speed knobs
        var s = self.bg.square.s, n = self.nuts(), t;
        self.n = n;
        self.knobs.clear();
        self.knobs.context.shadowBlur = 0;
        self.drawKnob(self.knobs.context, n.x1, n.y1, s * 0.08, self.editable ? '#7a5' : '#555', '1x');
        self.drawKnob(self.knobs.context, n.x2, n.y1, s * 0.08, self.editable ? '#c55' : '#555', '+');
        self.drawKnob(self.knobs.context, n.x2, n.y2, s * 0.08, self.editable ? '#57a' : '#555', '-');
        //self.drawKnob(self.knobs.context, n.x1, n.y2, s * 0.08, '#555', '00', '#030', 'Crystal');
        t = SC.time.speed.toString();
        if (t.length === 1) {
            t = ' ' + t;
        }
        self.knobs.circle(n.x1, n.y2, s * 0.08, '#333', 0);
        self.knobs.fillStyle = 'blue';
        self.knobs.context.textAlign = 'center';
        self.knobs.context.textBaseline = 'middle';
        self.knobs.context.font = (1.2 * s * 0.08).toFixed(1) + 'px Crystal';
        self.knobs.context.fillStyle = '#030';
        self.knobs.context.fillText('00', n.x1, n.y2);
        self.knobs.context.shadowColor = 'lime';
        self.knobs.context.shadowBlur = 5;
        self.knobs.context.fillStyle = 'lime';
        self.knobs.context.fillText(t, n.x1, n.y2);
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
        t = 0.02 * s;
        self.drawRadialMarks(self.bg.context, 60, cx, cy, s * 0.38, s * 0.4, 'white', t, []);
        self.drawRadialMarks(self.bg.context, 12, cx, cy, s * 0.36, s * 0.4, 'white', t, []);
        // day
        self.dayHoleY = cy - 0.15 * s;
        self.bg.context.font = "bold " + 0.07 * s + "px sans-serif";
        self.bg.context.textBaseline = "bottom";
        self.bg.context.textAlign = "center";
        self.bg.context.fillStyle = "white";
        self.bg.context.fillText('day', cx, self.dayHoleY);
        // rectangle for day
        self.drawHole(self.bg.context, cx, self.dayHoleY, 0.10 * s, 0.08 * s);
        // rectangle for am/pm
        self.amHoleY = cy + 0.08 * s;
        self.drawHole(self.bg.context, cx, self.amHoleY, 0.06 * s, 0.08 * s);
        // numbers
        self.drawRadialNumbers(self.bg.context, cx, cy, 0.3 * s, 12);
        // glare
        self.fg.clear();
        self.drawGlare(self.fg.context, self.fg.square);
        // knobs
        self.drawKnobs();
        // hands
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    self.fg.canvas.addEventListener('click', function (event) {
        // handle knobs to speed up time
        var xy = SC.getAbsolutePosition(event.target, event),
            x = xy.x,
            y = xy.y,
            d = 0.1 * self.fg.square.s,
            dx1 = (Math.abs(x - self.n.x1) < d),
            dx2 = (Math.abs(x - self.n.x2) < d),
            dy1 = (Math.abs(y - self.n.y1) < d),
            dy2 = (Math.abs(y - self.n.y2) < d);
        if (self.editable) {
            if (dx1 && dy1) {
                self.clicktime = 0;
                SC.time.speed = 1;
                self.drawKnobs();
            }
            if (dx2 && dy1) {
                self.clicktime = 0;
                SC.time.faster();
                self.drawKnobs();
            }
            if (dx2 && dy2) {
                self.clicktime = 0;
                SC.time.slower();
                self.drawKnobs();
            }
            if (dx1 && dy2) {
                console.log('x');
            }
        }
        //event.preventDefault();
        //event.cancelBubble = true;
    }, true);

    return self;
};

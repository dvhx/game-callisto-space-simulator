// Gauge "thrust" (displays how many thrusters are on and their throttle)
"use strict";
// globals: window, document, localStorage

var SC = window.SC || {};

function am() {
    var m = localStorage.getItem('SC.gaugeThrust.audioMode') || 'new';
    if (m === 'old') {
        SC.panel.thrusters.mode('new');
    } else {
        SC.panel.thrusters.mode('old');
    }
}

SC.gaugeThrust = function (aParent) {
    var self = SC.gauge(aParent, 'bg,hands,black,leds,fg');
    self.updateInterval = 0.1;

    self.audioMode = localStorage.getItem('SC.gaugeThrust.audioMode') || 'new';
    //console.warn('SC.gaugeThrust.audioMode', self.audioMode);

    self.mode = function (aMode) {
        localStorage.setItem('SC.gaugeThrust.audioMode', aMode);
        document.location.reload();
    };

    if (self.audioMode === 'old') {
        self.sound = document.createElement('audio');
        self.sound.src = 'sound/engine.ogg';
        self.sound.volume = 1;
        self.sound.loop = true;
    }
    if (self.audioMode === 'new') {
        self.sound = SC.audioLoop('sound/engine.ogg', 0, 0.3);
    }

    self.state = {
        max: 1.0, // Maximal thrust, 0..1
        f: false, // Forward thruster on/off
        b: false, // Backward thruster on/off
        l: false, // Left thruster on/off
        r: false, // Right thruster on/off
        u: false, // Up thruster on/off
        d: false  // Down thruster on/off
    };

    self.update = function (aState, aForceRedraw) {
        // draw hands
        if (!self.enabled || self.hidden) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }

        var len, x, y, cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, led_count = 0;
        self.hands.clear();

        // count active thrusters
        led_count += aState.l ? 1 : 0;
        led_count += aState.r ? 1 : 0;
        led_count += aState.u ? 1 : 0;
        led_count += aState.d ? 1 : 0;
        led_count += aState.f ? 1 : 0;
        led_count += aState.b ? 1 : 0;
        if (led_count > 4) {
            led_count = 4.3; // go slightly after max, but not around
        }
        if (self.broken) {
            aState.l = false;
            aState.r = false;
            aState.u = false;
            aState.d = false;
            aState.f = false;
            aState.b = false;
        }

        // orange arrow
        len = 0.28 * s;
        x = len * Math.cos(Math.PI / 6 + led_count * Math.PI / 6);
        y = len * Math.sin(Math.PI / 6 + led_count * Math.PI / 6);
        self.hands.context.lineWidth = 0.03 * s;
        self.hands.context.strokeStyle = 'orange';
        self.hands.context.beginPath();
        self.hands.context.moveTo(cx, cy + 0.25 * s);
        self.hands.context.lineTo(cx - x, cy + 0.25 * s - y);
        self.hands.context.closePath();
        self.hands.context.stroke();

        // green arrow
        len = 0.28 * s;
        x = len * Math.cos(Math.PI / 6 + 4 * Math.min(1.1, aState.max) * Math.PI / 6);
        y = len * Math.sin(Math.PI / 6 + 4 * Math.min(1.1, aState.max) * Math.PI / 6);
        self.hands.context.lineWidth = 0.015 * s;
        self.hands.context.strokeStyle = 'lime';
        self.hands.context.beginPath();
        self.hands.context.moveTo(cx, cy + 0.25 * s);
        self.hands.context.lineTo(cx - x, cy + 0.25 * s - y);
        self.hands.context.closePath();
        self.hands.context.stroke();

        // leds
        self.leds.clear();
        self.drawLed(self.leds.context, cx - 0.25 * s, cy + 0.23 * s, 0.045 * s, 'lime', aState.f, 'F');
        self.drawLed(self.leds.context, cx - 0.25 * s, cy + 0.31 * s, 0.045 * s, 'lime', aState.b, 'B');
        self.drawLed(self.leds.context, cx + 0.15 * s, cy + 0.23 * s, 0.045 * s, 'lime', aState.u, 'U');
        self.drawLed(self.leds.context, cx + 0.15 * s, cy + 0.31 * s, 0.045 * s, 'lime', aState.d, 'D');
        self.drawLed(self.leds.context, cx - 0.09 * s, cy + 0.38 * s, 0.045 * s, 'lime', aState.l, 'L');
        self.drawLed(self.leds.context, cx + 0.03 * s, cy + 0.38 * s, 0.045 * s, 'lime', aState.r, 'R');

        if (led_count > 0) {
            if (self.audioMode === 'old') {
                self.sound.play();
            }
            if (self.audioMode === 'new') {
                self.sound.setVolume(aState.max / Math.sqrt(2));
            }
        } else {
            if (self.audioMode === 'old') {
                self.sound.pause();
            }
            if (self.audioMode === 'new') {
                self.sound.setVolume(0);
            }
        }

        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, rm, i, lab, k = 0.35;
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
        self.black.clear();
        self.black.context.strokeStyle = 'white';
        self.black.context.lineWidth = 1;
        self.black.context.beginPath();
        self.black.context.fillStyle = '#111';
        self.black.context.arc(cx, cy, 0.425 * s, k * Math.PI + Math.PI / 2, (2 - k) * Math.PI + Math.PI / 2, true);
        self.black.context.fill();
        self.black.context.closePath();
        // black circle
        self.fg.clear();
        self.black.context.arc(cx, cy + 0.25 * s, 0.15 * s, 0, 2 * Math.PI, true);
        self.black.context.fill();
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
        self.bg.context.textBaseline = 'bottom';
        lab = ['0', '1', '2', '3', '4'];
        for (i = 0; i < rm.length; i++) {
            self.bg.context.fillStyle = i > 1 ? '#f77' : 'white';
            self.bg.context.fillText(lab[i], rm[i].x2, rm[i].y2 - 0.015 * s);
        }
        // green marks
        rm = self.drawRadialMarks(self.bg.context, 11, cx, cy + 0.25 * s, 0.25 * s, 0.29 * s, 'green', 0.01 * s, [], 1.17 * Math.PI, (2 - 0.17) * Math.PI, true, false);
        // active thrusters
        self.bg.context.fillStyle = 'white';
        self.bg.context.font = 'bold ' + 0.07 * s + 'px sans-serif';
        self.bg.context.textBaseline = 'bottom';
        self.bg.context.fillText('Active', cx, cy - 0.27 * s);
        self.bg.context.textBaseline = 'top';
        self.bg.context.fillText('thrusters', cx, cy - 0.27 * s);
        // bolt
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    return self;
};

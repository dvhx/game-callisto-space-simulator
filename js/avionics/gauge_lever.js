// Vertical lever (1D joystick)
"use strict";
// globals: window, document, setTimeout

var SC = window.SC || {};

SC.gaugeLever = function (aParent, aTopLabel, aBottomLabel, aLabelColor) {
    var self = SC.gauge(aParent, 'bg,fg');
    self.updateInterval = 1.0;
    self.closeupDisabled = true;

    self.state = {
        value: 0
    };

    self.update = function (aState, aForceRedraw) {
        // draw lever and stick
        if (!self.enabled || self.hidden) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        if (self.broken) {
            aState = {
                value: 0
            };
        }
        var cx = self.fg.square.cx, cy = self.fg.square.cy, w = self.fg.w, h = self.fg.h, s = w,
            k = 0.5,
            k3 = 0.3,
            ctx = self.fg.context,
            y1,
            grd,
            y = cy + aState.value * 0.6 * h / 2;

        self.fg.clear();

        // stick
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 0.18 * s;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy + s * k3 * aState.value);
        ctx.lineTo(cx, y);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#777';
        ctx.lineWidth = 0.07 * s;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 2, cy + s * k3 * aState.value * 0.95);
        ctx.lineTo(cx - 2, y - 5);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 0.03 * s;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy + s * k3 * aState.value * 0.90);
        ctx.lineTo(cx, y - 7);
        ctx.closePath();
        ctx.stroke();

        // shadow
        grd = ctx.createRadialGradient(cx, y + 0.1 * s, 0, cx, y + 0.1 * s, s / 2);
        grd.addColorStop(0, "rgba(0,0,0,0.5)");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, y + 0.1 * s, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // pad
        k = 0.2 * w;
        y1 = y - k;
        ctx.drawImage(self.pad, 0, y1);

        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
        // callback
        if (self.callback) {
            self.callback(self.state);
        }
    };

    self.render = function () {
        // render everything
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        var cx = self.bg.square.cx, cy = self.bg.square.cy, w = self.bg.w, h = self.bg.h, i, y, x, k, pw, ph, grd, ctx;
        // bevel
        self.bg.clear();
        self.bevel(self.bg.context, 5, 5, w - 5, h - 5, 5, false);
        // bolts
        self.drawBolt(self.bg.context, 12, 12, 4);
        self.drawBolt(self.bg.context, w - 12, 12, 4);
        self.drawBolt(self.bg.context, w - 12, h - 12, 4);
        self.drawBolt(self.bg.context, 12, h - 12, 4);
        // labels
        if (aTopLabel) {
            self.bg.context.textBaseline = 'top';
            self.bg.context.textAlign = 'center';
            self.bg.context.fillStyle = aLabelColor;
            self.bg.context.fillText(aTopLabel, cx, cy - h / 2 + 5 + 2);
        }
        if (aBottomLabel) {
            self.bg.context.textBaseline = 'bottom';
            self.bg.context.textAlign = 'center';
            self.bg.context.fillStyle = aLabelColor;
            self.bg.context.fillText(aBottomLabel, cx, cy + h / 2 - 5 - 2);
        }
        // marks
        for (i = 0; i <= 10; i++) {
            y = cy + i * cy / 17;
            k = i % 5 === 0 ? 8 : 20;
            self.bg.line(k, y, w - k, y, 'white', 0.3);
            y = cy - i * cy / 17;
            self.bg.line(k, y, w - k, y, 'white', 0.3);
        }
        // hole for stick
        self.drawHole(self.bg.context, cx, 20, 0.1 * w, h - 40);
        // cache knurled pad
        pw = w;
        ph = 0.18 * h;
        self.pad = document.createElement('canvas');
        ctx = self.pad.getContext('2d');
        self.pad.width = pw;
        self.pad.height = ph;
        grd = ctx.createLinearGradient(0, 0, 0, ph);
        grd.addColorStop(0.0, '#aaa');
        grd.addColorStop(0.1, '#ccc');
        grd.addColorStop(0.5, '#777');
        grd.addColorStop(0.8, '#444');
        grd.addColorStop(1.0, '#222');
        ctx.fillStyle = grd;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0, w, 0);
        ctx.lineTo(w, 0, w, ph);
        ctx.lineTo(w, ph, 0, ph);
        ctx.lineTo(0, ph, 0, 0);
        ctx.closePath();
        ctx.fill();
        // knurling
        k = ph;
        ctx.fillStyle = 'black';
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = 'black';
        for (x = -k; x < w + k; x += 4) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(x, 0);
            ctx.lineTo(x + k, ph);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.moveTo(x + 0.3, 0);
            ctx.lineTo(x + k + 0.3, ph);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(x + k, 0);
            ctx.lineTo(x, ph);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.moveTo(x + k + 0.3, 0);
            ctx.lineTo(x + 0.3, ph);
            ctx.stroke();
        }
        // update
        self.update(self.state, true);
        self.renderCount++;
    };

    self.render();

    // touch controls

    function onTouchStart(event) {
        if (!self.enabled) {
            return;
        }
        event.preventDefault();
        var cy = self.fg.square.cy,
            e = event.targetTouches ? event.targetTouches[0] : event,
            y = 2.5 * (e.clientY - self.abs.y - cy) / self.fg.h;
        y = Math.min(Math.max(-1, y), 1);
        self.update({value: y}, true);
    }

    function onTouchMove(event) {
        if (!self.enabled) {
            return;
        }
        event.preventDefault();
        var cy = self.fg.square.cy,
            e = event.targetTouches ? event.targetTouches[0] : event,
            y = 2.5 * (e.clientY - self.abs.y - cy) / self.fg.h;
        y = Math.min(Math.max(-1, y), 1);
        self.update({value: y}, true);
    }

    function onTouchEnd(event) {
        // return pad to center
        if (!self.enabled) {
            return;
        }
        event.preventDefault();
        function one() {
            self.update({value: 0.7 * self.state.value}, true);
            if (Math.abs(self.state.value) > 0.05) {
                setTimeout(one, 20);
            } else {
                self.update({value: 0}, true);
            }
        }
        one();
    }

    self.fg.canvas.addEventListener('touchstart', onTouchStart, true);
    self.fg.canvas.addEventListener('touchmove', onTouchMove, true);
    self.fg.canvas.addEventListener('touchend', onTouchEnd, true);

    // mouse controls
    self.onMouseDown = function (event) {
        if (event.which === 1) {
            onTouchStart(event);
        }
    };
    self.onMouseMove = function (event) {
        if (event.which === 1) {
            onTouchMove(event);
        }
    };
    self.onMouseUp = function (event) {
        onTouchEnd(event);
    };
    SC.mouse.register(self);

    return self;
};

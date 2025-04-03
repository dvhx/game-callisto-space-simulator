// Gauge "joystick" (2 axis ball knob)
"use strict";
// globals: window, document, setTimeout

var SC = window.SC || {};

SC.gaugeJoystick = function (aParent, aKnobColors, aOrtoColors) {
    var self = SC.gauge(aParent, 'bg,fg'), kc;
    self.updateInterval = 1.0;
    self.sensitivity = 1;
    self.fast = false; // don't render rubber
    self.closeupDisabled = true;

    self.state = {
        x: 0,
        y: 0,
        h: true,
        v: true
    };

    kc = aKnobColors || ["#9f9", "#6c6", "#4a4", "#252", "#131"];
    if (kc === 'green') {
        kc = ["#9f9", "#6c6", "#4a4", "#252", "#131"];
    }
    if (kc === 'red') {
        kc = ["#f99", "#c66", "#a44", "#522", "#311"];
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
                x: 0,
                y: 0
            };
        }
        // render pads
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, s2 = s / 2, ball_size,
            k = 0.707 * 0.41 * 0.3,
            k3 = 0.41 * 0.7,
            h = 'rgba(255,255,255,0.2)',
            t = 'transparent',
            x, y,
            bx, by,
            grd, grd2,
            ctx = self.fg.context;
        self.fg.clear();
        x = aState.x / self.sensitivity;
        y = aState.y / self.sensitivity;
        x = Math.min(Math.max(-1, x), 1);
        y = Math.min(Math.max(-1, y), 1);
        if (!self.fast) {
            // rubber
            grd = ctx.createRadialGradient(cx + x * k * s, cy + y * k * s, 0, cx, cy, s2);
            grd.addColorStop(0.0, '#444');
            grd.addColorStop(0.15, '#222');
            grd.addColorStop(0.2, '#222');
            grd.addColorStop(0.3, 'gray');
            grd.addColorStop(0.4, '#222');
            grd.addColorStop(0.5, 'gray');
            grd.addColorStop(0.6, '#222');
            grd.addColorStop(0.7, 'gray');
            grd.addColorStop(0.8, '#222');
            grd.addColorStop(0.9, 'black');
            grd.addColorStop(1.0, 'gray');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(cx, cy, 0.41 * s, 0, 2 * Math.PI);
            ctx.fill();
            // rubber highlight
            grd2 = ctx.createRadialGradient(cx + x * k * s, cy + y * k * s, 0, cx * 1.05, cy * 1.05, s2);
            grd2.addColorStop(0.0, h);
            grd2.addColorStop(0.15, t);
            grd2.addColorStop(0.2, h);
            grd2.addColorStop(0.3, t);
            grd2.addColorStop(0.4, h);
            grd2.addColorStop(0.5, t);
            grd2.addColorStop(0.6, h);
            grd2.addColorStop(0.7, t);
            grd2.addColorStop(0.8, h);
            grd2.addColorStop(0.9, t);
            grd2.addColorStop(1.0, h);
            // highlight
            ctx.fillStyle = grd2;
            ctx.beginPath();
            ctx.arc(cx, cy, 0.41 * s, 0, 2 * Math.PI);
            ctx.fill();
        }
        // stick
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.15 * s;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.lineTo(cx + s * k * x, cy + s * k * y);
        ctx.lineTo(cx + s * k3 * x, cy + s * k3 * y);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#777';
        ctx.lineWidth = 0.07 * s;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.lineTo(cx + s * k * x, cy + s * k * y - 5);
        ctx.lineTo(cx + s * k3 * x, cy + s * k3 * y - 5);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 0.03 * s;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.lineTo(cx + s * k * x, cy + s * k * y - 7);
        ctx.lineTo(cx + s * k3 * x, cy + s * k3 * y - 7);
        ctx.closePath();
        ctx.stroke();
        // ball shadow
        bx = cx + s * 0.32 * x + 0.05 * s;
        by = cy + s * 0.32 * y + 0.05 * s;
        grd = ctx.createRadialGradient(bx, by, 0, bx, by, 0.2 * s);
        grd.addColorStop(0, "rgba(0,0,0,0.5)");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(bx, by, 0.2 * s, 0, Math.PI * 2);
        ctx.fill();
        // ball
        ball_size = 0.15 * s;
        grd = ctx.createRadialGradient(cx + s * k3 * x - ball_size / 2, cy + s * k3 * y - ball_size / 2, 0, cx + s * k3 * x, cy + s * k3 * y, ball_size);
        grd.addColorStop(0.3, kc[0]);
        grd.addColorStop(0.4, kc[1]);
        grd.addColorStop(0.6, kc[2]);
        grd.addColorStop(0.9, kc[3]);
        grd.addColorStop(1.0, kc[4]);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx + s * k3 * x, cy + s * k3 * y, ball_size, 0, Math.PI * 2);
        ctx.fill();
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
        var cx = self.bg.square.cx, cy = self.bg.square.cy, s = self.bg.square.s;
        // dial
        self.bg.clear();
        self.drawDial(self.bg.context, self.bg.square);
        self.bg.circle(cx, cy, s * 0.20, '#2a2a2a', 0);
        self.bg.circle(cx, cy, s * 0.19, '#222222', 0);
        self.bg.circle(cx, cy, s * 0.18, '#1a1a1a', 0);
        self.bg.circle(cx, cy, s * 0.17, '#111111', 0);
        self.bg.circle(cx, cy, s * 0.16, '#000000', 0);
        // orto indicator
        //self.drawKnob(self.bg.context, cx + 0.39 * s, cy - 0.39 * s, 0.07 * s, '#444');
        self.orto = {
            x: cx + 0.39 * s,
            y: cy - 0.39 * s,
            x1: cx + 0.39 * s - 0.04 * s,
            x2: cx + 0.39 * s + 0.04 * s,
            y1: cy - 0.39 * s - 0.04 * s,
            y2: cy - 0.39 * s + 0.04 * s
        };
        aOrtoColors = aOrtoColors || {h: 'lime', v: 'lime'};
        // orto
        self.bg.context.fillStyle = '#333';
        self.bg.circle(self.orto.x, self.orto.y, 0.07 * s, '#333', 0);
        self.drawLed(self.bg.context, self.orto.x1, self.orto.y, 0.04 * s, aOrtoColors.h, self.state.h, '');
        self.drawLed(self.bg.context, self.orto.x2, self.orto.y, 0.04 * s, aOrtoColors.h, self.state.h, '');
        self.drawLed(self.bg.context, self.orto.x, self.orto.y1, 0.04 * s, aOrtoColors.v, self.state.v, '');
        self.drawLed(self.bg.context, self.orto.x, self.orto.y2, 0.04 * s, aOrtoColors.v, self.state.v, '');
        // pads
        self.update(self.state, true);
        self.renderCount++;
    };

    self.render();

    function onTouchStart(event) {
        if (!self.enabled) {
            return;
        }
        event.preventDefault();
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, s2 = s / 2,
            e = event.targetTouches ? event.targetTouches[0] : event,
            x = (e.clientX - self.abs.x - cx) / s2,
            y = (e.clientY - self.abs.y - cy) / s2;
        x *= self.sensitivity;
        y *= self.sensitivity;
        x = Math.min(Math.max(-1, x), 1);
        y = Math.min(Math.max(-1, y), 1);
        if (!self.state.h) {
            x = 0;
        }
        if (!self.state.v) {
            y = 0;
        }
        self.update({x: x, y: y, h: self.state.h, v: self.state.v});
    }

    function onTouchMove(event) {
        if (!self.enabled) {
            return;
        }
        event.preventDefault();
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, s2 = s / 2,
            e = event.targetTouches ? event.targetTouches[0] : event,
            x = (e.clientX - self.abs.x - cx) / s2,
            y = (e.clientY - self.abs.y - cy) / s2;
        x *= self.sensitivity;
        y *= self.sensitivity;
        x = Math.min(Math.max(-1, x), 1);
        y = Math.min(Math.max(-1, y), 1);
        if (!self.state.h) {
            x = 0;
        }
        if (!self.state.v) {
            y = 0;
        }
        self.update({x: x, y: y, h: self.state.h, v: self.state.v});
    }

    function onTouchEnd(event) {
        if (!self.enabled) {
            return;
        }
        event.preventDefault();
        // slowly return pad to center
        function one() {
            self.update({x: 0.7 * self.state.x, y: 0.7 * self.state.y, h: self.state.h, v: self.state.v});
            if (Math.sqrt(self.state.x * self.state.x + self.state.y * self.state.y) > 0.05) {
                setTimeout(one, 20);
            } else {
                self.update({x: 0, y: 0, h: self.state.h, v: self.state.v});
            }
        }
        one();
    }

    // touch controls
    self.fg.canvas.addEventListener('touchstart', onTouchStart, true);
    self.fg.canvas.addEventListener('touchmove', onTouchMove, true);
    self.fg.canvas.addEventListener('touchend', onTouchEnd, true);

    // mouse controls
    self.onMouseDown = function (event) {
        //console.log('mousedown x', event.clientX, 'y', event.clientY, 'w', event.which);
        if (event.which === 1) {
            onTouchStart(event);
        }
    };
    self.onMouseMove = function (event) {
        //console.log('mousemove x', event.clientX, 'y', event.clientY, 'w', event.which);
        if (event.which === 1) {
            onTouchMove(event);
        }
    };
    self.onMouseUp = function (event) {
        //console.log('mouseup x', event.clientX, 'y', event.clientY, 'w', event.which);
        onTouchEnd(event);
    };
    SC.mouse.register(self);

    /*
    self.fg.canvas.addEventListener('mousedown', function (event) {
        if (event.which === 1) {
            SC.lastMouseTarget = event.target;
            onTouchStart(event);
        }
    }, true);
    self.fg.canvas.addEventListener('mousemove', function (event) {
        if (event.which === 1 && event.target === SC.lastMouseTarget) {
            onTouchMove(event);
        }
    }, true);
    self.fg.canvas.addEventListener('mouseup', function (event) {
        onTouchEnd(event);
        SC.lastMouseTarget = null;
    }, true);
    self.fg.canvas.addEventListener('mouseout', function (event) {
        onTouchEnd(event);
        //SC.lastMouseTarget = null;
    }, true);
    */

    return self;
};

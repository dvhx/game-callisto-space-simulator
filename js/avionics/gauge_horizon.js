// Gauge "artificial horizon" (it need some work)
"use strict";
// globals: window, document

var SC = window.SC || {};

SC.gaugeHorizon = function (aParent) {
    // create artificial horizon gauge
    var self = SC.gauge(aParent, 'bg,hands,fg');
    self.updateInterval = 0.3;

    self.state = {
        pitch: 0,
        roll: 0
    };

    function layer(aWidth, aHeight) {
        // create temporary canvas
        var tmp = document.createElement('canvas');
        tmp.width = aWidth;
        tmp.height = aHeight;
        return {canvas: tmp, context: tmp.getContext('2d')};
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
                pitch: 0,
                roll: 0
            };
        }
        // draw moving center part
        var tmp, cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, y, angle, positive_angle;
        // pitch
        // get positive angle
        angle = 180 * aState.pitch / Math.PI;
        positive_angle = (angle + 180) % 360;
        if (positive_angle < 0) {
            positive_angle = 360 + positive_angle;
        }
        // convert angle to y
        y = 0;
        if (positive_angle >= 0 && positive_angle <= 90) {
            y = (s * 100 / 100) - (positive_angle / 90) * (s * 50 / 100);
        }
        if (positive_angle > 90 && positive_angle <= 360) {
            y = s * 250 / 100 - ((positive_angle - 90) / 270) * (s * 150 / 100);
        }
        // draw into tmp layer (otherwise after 10-15 minutes it slows down)
        tmp = layer(self.hands.w, self.hands.h);
        tmp.context.translate(cx, cy);
        tmp.context.rotate(aState.roll);
        tmp.context.translate(-cx, -cy);
        tmp.context.drawImage(self.sg.canvas, 0, y - s / 2, s, s, self.fg.square.x, self.fg.square.y, self.fg.square.w, self.fg.square.h); //, s, 4 * s);
        // keep only center
        tmp.context.globalCompositeOperation = 'destination-in';
        tmp.context.arc(cx, cy, 0.340 * s, 0, 2 * Math.PI, true);
        tmp.context.fill();
        // draw tmp to hands
        self.hands.context.drawImage(tmp.canvas, 0, 0);
        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        var cx = self.fg.square.cx, cy = self.fg.square.cy, s = self.fg.square.s, i, lip, rim, rim_shadow, k, label;
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
        // sky-ground-sky cylinder
        self.sg = layer(s, 3 * s);
        self.sg.context.fillStyle = '#a44';
        self.sg.context.fillRect(0, 0, s, s);
        self.sg.context.fillStyle = '#39f';
        self.sg.context.fillRect(0, s, s, 2 * s);
        self.sg.context.fillStyle = '#a44';
        self.sg.context.fillRect(0, 2 * s, s, 3 * s);
        // lines on cylinder
        self.sg.context.strokeStyle = 'white';
        self.sg.context.font = (0.07 * s) + 'px sans-serif';
        self.sg.context.textBaseline = 'middle';
        self.sg.context.textAlign = 'center';
        for (i = 0; i < 360; i += 1) {
            label = i % 180;
            if (label > 90) {
                label = 180 - label;
            }
            label *= 2;
            self.sg.context.fillStyle = 'yellow';
            k = label % 30 === 0 ? 0.2 : 0.15;
            self.sg.context.lineWidth = label % 30 === 0 ? 0.009 * s : 0.003 * s;
            if (label % 10 === 0) {
                self.sg.context.beginPath();
                self.sg.context.moveTo(s / 2 - k * s, (i / 360) * 4 * s);
                self.sg.context.lineTo(s / 2 - 0.07 * s, (i / 360) * 4 * s);
                self.sg.context.moveTo(s / 2 + 0.07 * s, (i / 360) * 4 * s);
                self.sg.context.lineTo(s / 2 + k * s, (i / 360) * 4 * s);
                self.sg.context.stroke();
            }
            if (label % 30 === 0) {
                self.sg.context.fillText(label, s / 2, (i / 360) * 4 * s);
            }
            // dot at 45 deg
            if (i === 157 || i === 112 || i === 67 || i === 202) {
                self.sg.context.fillStyle = 'white';
                self.sg.context.beginPath();
                self.sg.context.arc(s / 2, (i / 360) * 4 * s, 0.01 * s, 0, 2 * Math.PI);
                self.sg.context.fill();
            }
        }
        // black side bars
        /*
        self.sg.context.fillStyle = 'black';
        self.sg.context.fillRect(0, 0, 0.2 * s, 3 * s);
        self.sg.context.fillRect(0.8 * s, 0, s, 3 * s);
        */
        // lips
        self.fg.clear();
        lip = layer(self.fg.w, self.fg.h);
        lip.context.shadowBlur = 0.14 * s;
        lip.context.shadowColor = 'black';
        lip.context.shadowOffsetX = 0;
        lip.context.shadowOffsetY = 0;
        // blue upper lip
        lip.context.fillStyle = '#39f';
        lip.context.beginPath();
        lip.context.arc(cx, cy, 0.33 * s, 1.75 * Math.PI, 1.25 * Math.PI, true);
        lip.context.fill();
        // brown bottom lip
        lip.context.fillStyle = '#a44';
        lip.context.beginPath();
        lip.context.arc(cx, cy, 0.33 * s, 0.75 * Math.PI, 0.25 * Math.PI, true);
        lip.context.fill();
        // keep only center
        lip.context.shadowBlur = 0;
        lip.context.globalCompositeOperation = 'destination-in';
        lip.context.beginPath();
        lip.context.arc(cx, cy, 0.33 * s, 0, 2 * Math.PI, true);
        lip.context.fill();
        self.fg.context.drawImage(lip.canvas, 0, 0);
        // outer rim
        rim = layer(self.fg.w, self.fg.h);
        rim_shadow = layer(self.fg.w, self.fg.h);
        // blue upper half
        rim.context.fillStyle = '#a44';
        rim.context.beginPath();
        rim.context.arc(cx, cy, 0.40 * s, -Math.PI, 0, true);
        rim.context.fill();
        // blue upper half
        rim.context.fillStyle = '#39f';
        rim.context.beginPath();
        rim.context.arc(cx, cy, 0.40 * s, 0, Math.PI, true);
        rim.context.fill();
        // remove center
        rim.context.globalCompositeOperation = 'destination-out';
        rim.context.fillStyle = 'white';
        rim.context.beginPath();
        rim.context.arc(cx, cy, 0.33 * s, 0, 2 * Math.PI, true);
        rim.context.fill();
        rim.context.globalCompositeOperation = 'source-over';
        // add shadow
        rim_shadow.context.shadowBlur = 0.14 * s;
        rim_shadow.context.shadowColor = 'black';
        rim_shadow.context.shadowOffsetX = 0;
        rim_shadow.context.shadowOffsetY = 0;
        rim_shadow.context.drawImage(rim.canvas, 0, 0);
        // keep only inner shadow
        rim_shadow.context.shadowBlur = 0;
        rim_shadow.context.globalCompositeOperation = 'destination-in';
        rim_shadow.context.beginPath();
        rim_shadow.context.arc(cx, cy, 0.4 * s, 0, 2 * Math.PI, true);
        rim_shadow.context.fill();
        self.fg.context.drawImage(rim_shadow.canvas, 0, 0);
        // white marks
        (function () {
            // white marks on rim
            var j, x, y, len1 = 0.33 * s, len2 = 0.36 * s, len3 = 0.40 * s;
            self.fg.context.save();
            self.fg.context.lineWidth = 2;
            self.fg.context.fillStyle = 'white';
            self.fg.context.strokeStyle = 'white';
            self.fg.context.beginPath();
            for (j = 0; j < 36; j++) {
                x = Math.cos((2 * j / 36) * Math.PI);
                y = Math.sin((2 * j / 36) * Math.PI);
                self.fg.context.moveTo(cx - len1 * x, cy - len1 * y);
                if (j % 3 === 0) {
                    self.fg.context.lineTo(cx - len3 * x, cy - len3 * y);
                } else {
                    self.fg.context.lineTo(cx - len2 * x, cy - len2 * y);
                }
            }
            self.fg.context.closePath();
            self.fg.context.stroke();
            self.fg.context.restore();
        }());
        // the ship on foreground
        (function () {
            self.fg.context.save();
            self.fg.context.shadowBlur = 4;
            self.fg.context.shadowColor = 'rgba(0, 0, 0, 0.5)';
            self.fg.context.shadowOffsetX = 2;
            self.fg.context.shadowOffsetY = 2;
            self.fg.context.lineCap = 'round';
            self.fg.context.lineJoin = 'round';
            self.fg.context.lineWidth = 0.02 * s;
            self.fg.context.strokeStyle = 'orange';
            self.fg.context.beginPath();
            self.fg.context.moveTo(cx, cy + 0.23 * s);
            self.fg.context.lineTo(cx, cy + 0.1 * s);
            self.fg.context.moveTo(cx + 0.1 * s, cy);
            self.fg.context.lineTo(cx + 0.23 * s, cy);
            self.fg.context.moveTo(cx - 0.1 * s, cy);
            self.fg.context.lineTo(cx - 0.23 * s, cy);
            self.fg.context.closePath();
            self.fg.context.stroke();
            self.fg.context.arc(cx, cy, 0.1 * s, -Math.PI, 0, true);
            self.fg.context.stroke();
            // brown post
            self.fg.context.lineWidth = 0.2;
            self.fg.context.fillStyle = '#a44';
            self.fg.context.strokeStyle = 'black';
            self.fg.context.beginPath();
            self.fg.context.moveTo(cx - 0.07 * s, cy + 0.203 * s);
            self.fg.context.lineTo(cx + 0.07 * s, cy + 0.203 * s);
            self.fg.context.lineTo(cx + 0.1 * s, cy + 0.4 * s);
            self.fg.context.quadraticCurveTo(cx, cy + 0.42 * s, cx - 0.1 * s, cy + 0.4 * s);
            self.fg.context.closePath();
            self.fg.context.fill();
            self.fg.context.stroke();
            self.fg.context.restore();
        }());
        // glare
        self.drawGlare(self.fg.context, self.fg.square);
        // hands
        self.update(self.state, true);
        self.renderCount++;
    };
    self.render();

    return self;
};

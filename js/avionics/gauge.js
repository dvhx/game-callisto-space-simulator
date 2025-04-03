// Ancestor for all avionics gauges
"use strict";
// globals: document, window, requestAnimationFrame, setTimeout

var SC = window.SC || {};

SC.gauges = [];
SC.gaugesChangedTime = 0;

SC.gauge = function (aParent, aLayers) {
    // Create one gauge (with multiple canvases)
    var self = {};
    SC.gauges.push(self);
    self.parent = typeof aParent === 'string' ? document.getElementById(aParent) : aParent;
    if (!self.parent) {
        throw "Gauge parent not found: " + aParent;
    }
    self.canvas = [];
    self.child = [];
    self.enabled = true;
    self.broken = false;
    self.hidden = false;
    self.round = false;
    self.closeupDisabled = false;

    self.enable = function (aEnabled) {
        // Enable or disable gauge, re-render
        self.enabled = aEnabled;
        self.update(self.state, true);
    };

    self.break = function (aBroken) {
        // Enable or disable gauge, re-render
        self.broken = aBroken;
        self.render();
    };

    // performance stats
    self.updateTime = 0;
    self.updateInterval = 5;
    self.updateCount = 0;
    self.renderCount = 0;

    self.old = function () {
        // return true if update interval have passed and gauge should be updated
        return self.enabled && (SC.time.s - self.updateTime >= self.updateInterval);
    };

    self.outline = function (aTop, aRight, aBottom, aLeft) {
        // Outline gauge for training missions
        SC.outline(self.canvas[0].canvas, aTop, aRight, aBottom, aLeft);
    };

    self.state = {};
    self.changed = function (aState) {
        // Return true if state changed
        if (!aState) {
            return false;
        }
        var k;
        for (k in self.state) {
            if (self.state.hasOwnProperty(k)) {
                if (self.state.hasOwnProperty(k) !== aState.hasOwnProperty(k)) {
                    return true;
                }
                if (self.state[k] !== aState[k]) {
                    return true;
                }
            }
        }
        for (k in aState) {
            if (aState.hasOwnProperty(k)) {
                if (self.state.hasOwnProperty(k) !== aState.hasOwnProperty(k)) {
                    return true;
                }
                if (self.state[k] !== aState[k]) {
                    return true;
                }
            }
        }
        return false;
    };

    self.add = function (aGauge) {
        // Add child gauge
        aGauge.parentGauge = self;
        self.child.push(aGauge);
    };

    self.container = document.createElement('div');
    self.container.className = 'gauge_container';
    self.container.style.position = 'relative';
    self.container.style.width = '100%';
    self.container.style.height = '100%';
    self.parent.appendChild(self.container);

    self.createCanvas = function () {
        // add one full-size canvas
        var c = SC.canvas(self.container);
        self.canvas.push(c);
        return c;
    };

    (function () {
        // Add all layers as canvases
        var i;
        if (aLayers) {
            aLayers = typeof aLayers === 'string' ? aLayers.split(',') : aLayers;
            for (i = 0; i < aLayers.length; i++) {
                self[aLayers[i]] = self.createCanvas();
            }
        }
    }());

    self.drawBolt = function (aContext, aX, aY, aSize) {
        // draw bolt (usually in background)
        if (aSize < 1) {
            return;
        }
        aSize = aSize || 6;

        // dark arc
        aContext.beginPath();
        aContext.lineWidth = 2;
        aContext.strokeStyle = '#222';
        aContext.arc(aX, aY, aSize, 0.8 * Math.PI, 1.7 * Math.PI, false);
        aContext.stroke();

        // bolt
        aContext.beginPath();
        aContext.fillStyle = '#444';
        aContext.arc(aX, aY, aSize - 1, 0, 2 * Math.PI, true);
        aContext.fill();
        aContext.closePath();

        // light arc
        aContext.beginPath();
        aContext.strokeStyle = '#555';
        aContext.arc(aX, aY, aSize, 1.7 * Math.PI, 0.8 * Math.PI, false);
        aContext.stroke();

        // slit
        aSize = aSize * 0.8;
        aContext.beginPath();
        aContext.lineWidth = 2;
        aContext.strokeStyle = '#222';
        aContext.moveTo(aX + aSize * 0.707, aY - aSize * 0.707);
        aContext.lineTo(aX - aSize * 0.707, aY + aSize * 0.707);
        aContext.stroke();

        aContext.lineWidth = 0.5;
        aContext.strokeStyle = '#ccc';
        aContext.beginPath();
        aContext.moveTo(aX + aSize * 0.707 + 1, aY - aSize * 0.707);
        aContext.lineTo(aX - aSize * 0.707, aY + aSize * 0.707 + 1);
        aContext.stroke();
        aContext.closePath();
    };

    self.drawDial = function (aContext, aSquare) {
        // draw standard round dial (frame, 4 bolts)
        self.round = true;
        var grad1, grad2,
            cx = aSquare.w / 2,
            cy = aSquare.h / 2,
            w = aSquare.w,
            h = aSquare.h,
            d = w * 10 / 300,
            f = w * 50 / 300,
            n5 = w * 5 / 300,
            n8 = w * 8 / 300,
            n13 = w * 13 / 300,
            n22 = w * 22 / 300,
            n33 = w * 33 / 300,
            n75 = w * 75 / 300,
            n95 = w * 95 / 300,
            n25 = w * 25 / 300,
            sz;

        // outer curvy part
        aContext.save();
        aContext.translate(aSquare.x, aSquare.y);
        aContext.lineWidth = 2;
        aContext.strokeStyle = '#555';
        aContext.fillStyle = '#333';
        aContext.beginPath();

        // ok, this is basically write-only code
        aContext.moveTo(d, f);
        aContext.bezierCurveTo(-n5, n25, n25, -n5, f, d); // upper left corner
        aContext.quadraticCurveTo(n75, n22, n95, n13);
        aContext.quadraticCurveTo(cx, -n8, h - n95, n13);
        aContext.quadraticCurveTo(w - n75, n22, w - f, d);
        aContext.bezierCurveTo(w - n25, -n5, w + n5, n25, w - d, f); // upper right corner
        aContext.quadraticCurveTo(w - n22, n75, w - n13, n95);
        aContext.quadraticCurveTo(w + n8 - 1, cy, w - n13, h - n95);
        aContext.quadraticCurveTo(w - n22, h - n75, w - n8, h - f);
        aContext.bezierCurveTo(w + n5, h - n25, w - n25, h + n5, w - f, h - d); // bottom right corner
        aContext.quadraticCurveTo(w - n75, h - n22, w - n95, h - n13);
        aContext.quadraticCurveTo(cx, h + n8 - 1, n95, h - n13);
        aContext.quadraticCurveTo(n75, h - n22, f, h - n8);
        aContext.bezierCurveTo(n25, h + n5, -n5, h - n25, d, h - f); // bottom left corner
        aContext.quadraticCurveTo(n22, h - n75, n13, h - n95);
        aContext.quadraticCurveTo(-n8, cy, n13, n95);
        aContext.quadraticCurveTo(n22, n75, d, f);

        aContext.shadowOffsetX = 0.3;
        aContext.shadowOffsetY = 0.3;
        aContext.shadowColor = "rgba(0, 0, 0, 0.6)";
        aContext.shadowBlur = 0.3;
        aContext.closePath();
        aContext.stroke();
        aContext.fill();
        aContext.shadowBlur = 0;
        aContext.shadowColor = '';
        aContext.shadowOffsetX = 0;
        aContext.shadowOffsetY = 0;

        // bolts
        n33 = w * 33 / 300;
        sz = w * 12 / 300;
        self.drawBolt(aContext, n33, n33, sz);
        self.drawBolt(aContext, w - n33, n33, sz);
        self.drawBolt(aContext, w - n33, h - n33, sz);
        self.drawBolt(aContext, n33, h - n33, sz);

        // define gradients for 3D / shadow effect
        grad1 = aContext.createLinearGradient(0, 0, w, h);
        grad1.addColorStop(0, "#555");
        grad1.addColorStop(1, "#222");

        grad2 = aContext.createLinearGradient(0, 0, w, h);
        grad2.addColorStop(0, "#222");
        grad2.addColorStop(1, "#555");

        // outer bezel
        aContext.save();
        aContext.strokeStyle = grad1;
        aContext.lineWidth = w * 10 / 300;
        aContext.beginPath();
        aContext.arc(cx, cy, 0.9 * cx, 0, Math.PI * 2, true);
        aContext.shadowOffsetX = 0.02 * aSquare.s;
        aContext.shadowOffsetY = 0.02 * aSquare.s;
        aContext.shadowColor = "rgba(0, 0, 0, 0.6)";
        aContext.shadowBlur = 0.02 * aSquare.s;
        aContext.stroke();
        // inner bezel
        aContext.strokeStyle = grad2;
        aContext.lineWidth = w * 10 / 300;
        aContext.beginPath();
        aContext.arc(cx, cy, 0.86 * cx, 0, Math.PI * 2, true);
        aContext.shadowColor = "rgba(0, 0, 0, 0.3)";
        aContext.shadowBlur = w * 6 / 300;
        aContext.stroke();
        aContext.strokeStyle = "white";
        aContext.restore();

        // thin white glare on rim
        aContext.strokeStyle = 'white';
        aContext.globalAlpha = 0.1;
        aContext.lineWidth = 1;
        aContext.beginPath();
        aContext.arc(cx, cy, 0.895 * cx, 0.9 * Math.PI, 1.6 * Math.PI, false);
        aContext.stroke();
        aContext.closePath();
        aContext.globalAlpha = 0.2;
        aContext.beginPath();
        aContext.arc(cx, cy, 0.895 * cx, Math.PI, 1.5 * Math.PI, false);
        aContext.stroke();
        aContext.closePath();
        aContext.globalAlpha = 0.2;
        aContext.beginPath();
        aContext.arc(cx, cy, 0.823 * cx, -0.2 * Math.PI, 0.7 * Math.PI, false);
        aContext.stroke();
        aContext.closePath();
        aContext.globalAlpha = 0.2;
        aContext.beginPath();
        aContext.arc(cx, cy, 0.823 * cx, -0.1 * Math.PI, 0.6 * Math.PI, false);
        aContext.stroke();
        aContext.closePath();

        aContext.restore();
    };

    // glare
    self.drawGlare = function (aContext, aSquare, aShapeCallback) {
        // draw glass glare, round or other shapes
        var g,
            cx = aSquare.w / 2,
            cy = aSquare.h / 2;
        aContext.save();
        g = aContext.createLinearGradient(0, 0, aSquare.w, aSquare.h);
        g.addColorStop(0, "#fff");
        g.addColorStop(1, "#000");
        aContext.save();
        aContext.beginPath();
        aContext.fillStyle = g;
        aContext.lineWidth = 0;
        aContext.globalAlpha = 0.5;
        if (aShapeCallback) {
            // e.g. aContext.fillRect(10, 10, aWidth - 20, aHeight - 20); or circle, etc..
            aShapeCallback(aContext);
        } else {
            aContext.translate(aSquare.x, aSquare.y);
            aContext.arc(cx, cy, cx * 0.85, 0, 2 * Math.PI, false);
            aContext.fill();
        }
        aContext.closePath();
        aContext.restore();
        aContext.restore();
    };

    self.drawRadialMarks = function (aContext, aCount, aX, aY, aMinRadius, aMaxRadius, aColor, aWidth, aSkip, aMinAngle, aMaxAngle, aSemi, aArc) {
        // draw short lines around given radius
        aMinAngle = aMinAngle || 0;
        aMaxAngle = aMaxAngle || 2 * Math.PI;
        var i, x1, y1, x2, y2, a = aMaxAngle - aMinAngle, tics = [];
        if (aSemi) {
            a /= aCount - 1;
        } else {
            a /= aCount;
        }
        aContext.strokeStyle = aColor;
        aContext.lineWidth = aWidth;
        for (i = 0; i < aCount; i++) {
            if (!aSkip || (aSkip.indexOf(i) < 0)) {
                x1 = aX + aMinRadius * Math.cos(i * a + aMinAngle);
                y1 = aY + aMinRadius * Math.sin(i * a + aMinAngle);
                x2 = aX + aMaxRadius * Math.cos(i * a + aMinAngle);
                y2 = aY + aMaxRadius * Math.sin(i * a + aMinAngle);
                tics.push({x1: x1, y1: y1, x2: x2, y2: y2, a: i * a + aMinAngle, a1: aMinAngle, a2: aMaxAngle, c: aCount});
                aContext.beginPath();
                aContext.moveTo(x1, y1);
                aContext.lineTo(x2, y2);
                aContext.stroke();
            }
        }
        if (aArc) {
            aContext.beginPath();
            aContext.arc(aX, aY, aMinRadius, aMinAngle, aMaxAngle, false);
            aContext.stroke();
            aContext.closePath();
        }
        return tics;
    };

    self.drawRadialNumbers = function (aContext, aX, aY, aRadius, aCount) {
        // draw numbers near marks
        var i, ang, nx, ny;
        aContext.save();
        aContext.fillStyle = 'white';
        aContext.lineWidth = 5;
        aContext.textBaseline = "middle";
        aContext.textAlign = "center";
        for (i = 1; i <= aCount; i++) {
            ang = 2 * Math.PI / aCount * i;
            nx = aRadius * Math.sin(ang);
            ny = -aRadius * Math.cos(ang);
            aContext.fillText(i, aX + nx, aY + ny);
        }
        aContext.restore();
    };

    self.bevel = function (aContext, aX1, aY1, aX2, aY2, aCornerRadius, aDepressed) {
        // rectangular bevel with rounded rectangles and shadow
        var r = aCornerRadius || 5;
        aContext.save();
        aContext.lineWidth = 2; //aDepressed ? 2 : 2;
        aContext.strokeStyle = '#555';
        aContext.fillStyle = '#333';
        aContext.shadowOffsetX = aDepressed ? -1 : 2;
        aContext.shadowOffsetY = aDepressed ? -1 : 2;
        aContext.shadowColor = "rgba(0, 0, 0, 0.6)";
        aContext.shadowBlur = 3;
        aContext.beginPath();
        aContext.moveTo(aX1 + r, aY1);
        aContext.lineTo(aX2 - r, aY1);
        aContext.quadraticCurveTo(aX2, aY1, aX2, aY1 + r);
        aContext.lineTo(aX2, aY2 - r);
        aContext.quadraticCurveTo(aX2, aY2, aX2 - r, aY2);
        aContext.lineTo(aX1 + r, aY2);
        aContext.quadraticCurveTo(aX1, aY2, aX1, aY2 - r);
        aContext.lineTo(aX1, aY1 + r);
        aContext.quadraticCurveTo(aX1, aY1, aX1 + r, aY1);
        aContext.closePath();
        aContext.stroke();
        aContext.fill();
        aContext.restore();
    };

    self.drawHole = function (aContext, aX, aY, aRadius, aHeight) {
        // draw hole with thin highlight around edges
        if (aRadius < 0) {
            return;
        }
        aContext.save();
        aContext.beginPath();
        aContext.lineWidth = 0.2;
        aContext.fillStyle = 'black';
        if (!aHeight) {
            aContext.arc(aX, aY, aRadius, 0, 2 * Math.PI, false);
        } else {
            // aContext.strokeRect(aX - aRadius, aY, 2 * aRadius, aHeight);
            aContext.moveTo(aX - aRadius, aY);
            aContext.lineTo(aX + aRadius, aY);
            aContext.lineTo(aX + aRadius, aY + aHeight);
            aContext.lineTo(aX - aRadius, aY + aHeight);
        }
        aContext.shadowBlur = 2;
        aContext.shadowOffsetX = +1;
        aContext.shadowOffsetY = +1;
        aContext.shadowColor = 'rgba(255,255,255,0.5)';
        aContext.fill();
        aContext.closePath();
        aContext.restore();
    };

    self.drawCap = function (aContext, aX, aY, aWidth, aHeight) {
        // Draw rectangular cap after removed gauge with bolts
        self.bevel(aContext, aX, aY, aWidth, aHeight, 5, false);
    };

    self.drawHand = function (aContext, aX, aY, aAngle, aLength, aWidth, aColor) {
        // draw single hand
        var x, y;
        aContext.strokeStyle = aColor;
        aContext.lineCap = 'round';
        aContext.lineWidth = aWidth;
        x = aLength * Math.cos(aAngle - Math.PI / 2);
        y = aLength * Math.sin(aAngle - Math.PI / 2);
        aContext.beginPath();
        aContext.moveTo(aX, aY);
        aContext.lineTo(aX + x, aY + y);
        aContext.shadowBlur = 3;
        aContext.shadowOffsetX = 3;
        aContext.shadowOffsetY = 3;
        aContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
        aContext.stroke();
        aContext.shadowBlur = 0;
        aContext.shadowOffsetX = 0;
        aContext.shadowOffsetY = 0;
        aContext.shadowColor = 'rgba(0, 0, 0, 0)';
    };

    self.drawLed = function (aContext, aX, aY, aDiameter, aColor, aLight, aLabel) {
        // Small indicator led with label
        aContext.strokeStyle = 'rgba(0,0,0,0.3)';
        aContext.fillStyle = aColor;
        aContext.lineCap = 'round';
        aContext.lineWidth = 1;
        aContext.beginPath();
        aContext.arc(aX, aY, aDiameter / 2, 0, 2 * Math.PI);
        aContext.shadowBlur = aDiameter / 2;
        aContext.shadowOffsetX = 0;
        aContext.shadowOffsetY = 0;
        if (!aLight) {
            aContext.globalAlpha = 0.3;
        }
        aContext.shadowColor = aLight ? aColor : 'black';
        aContext.fill();
        aContext.stroke();
        // label
        aContext.shadowBlur = 0;
        aContext.shadowColor = '';
        aContext.globalAlpha = 1;
        aContext.fillStyle = 'white';
        aContext.font = 1.7 * aDiameter + 'px sans-serif';
        aContext.textBaseline = 'middle';
        aContext.textAlign = 'left';
        aContext.fillText(aLabel, aX + 0.9 * aDiameter, aY + 0.5);
    };

    self.drawKnob = function (aContext, aX, aY, aRadius, aColor, aLabel, aLabelColor, aLabelFont) {
        // Draw radial knob
        if (aRadius <= 0) {
            return;
        }
        aContext.fillStyle = aColor;
        aContext.beginPath();
        aContext.arc(aX, aY, aRadius, 0, 2 * Math.PI);
        aContext.fill();
        // knob highlight
        aContext.strokeStyle = 'rgba(255,255,255,0.3)';
        aContext.lineWidth = 1;
        aContext.beginPath();
        aContext.arc(aX, aY, aRadius, 2.1, 5.3);
        aContext.stroke();
        aContext.lineWidth = 1.5;
        aContext.beginPath();
        aContext.arc(aX, aY, aRadius, 2.5, 5.0);
        aContext.stroke();
        aContext.lineWidth = 2;
        aContext.beginPath();
        aContext.arc(aX, aY, aRadius, 2.9, 4.6);
        aContext.stroke();
        // shadow
        aContext.strokeStyle = 'rgba(0,0,0,0.5)';
        aContext.lineWidth = 2;
        aContext.beginPath();
        aContext.arc(aX, aY, aRadius, 3.14 + 2.9, 3.14 + 4.6);
        aContext.stroke();
        // label
        if (aLabel) {
            aContext.textAlign = 'center';
            aContext.textBaseline = 'middle';
            aContext.font = 'bold ' + (1.2 * aRadius).toFixed(1) + 'px ' + (aLabelFont || 'sans-serif');
            aContext.fillStyle = 'rgba(255,255,255,0.5)';
            if (aLabelFont !== 'Crystal') {
                aContext.fillText(aLabel, aX + 1, aY + 1);
            } else {
                aContext.font = (1.2 * aRadius).toFixed(1) + 'px ' + (aLabelFont || 'sans-serif');
            }
            aContext.fillStyle = aLabelColor || 'rgba(0,0,0,0.5)';
            aContext.fillText(aLabel, aX, aY);
        }
    };

    self.abs = SC.getAbsolutePosition(self.parent);
    window.addEventListener('resize', function () {
        self.abs = SC.getAbsolutePosition(self.container);
        // no idea why it has to be delayed
        requestAnimationFrame(self.render);
    });

    self.resize = function () {
        // resize all canvases and call render
        var i;
        for (i = 0; i < self.canvas.length; i++) {
            self.canvas[i].resize();
        }
        for (i = 0; i < self.child.length; i++) {
            self.child[i].resize();
        }
        if (self.bg) {
            self.abs = SC.getAbsolutePosition(self.bg.canvas);
        }
        // no idea why it has to be delayed
        requestAnimationFrame(function () {
            self.render();
            for (i = 0; i < self.child.length; i++) {
                self.child[i].resize();
                self.child[i].render();
            }
        });
    };

    // double click will show closeup
    self.inCloseup = false;
    self.clicktime = 0;
    self.container.addEventListener('click', function (event) {
        if (self.closeupDisabled || !self.enabled) {
            return;
        }
        var closeup = document.getElementById('closeup'),
            closeup_container = document.getElementById('closeup_container'),
            g;
        // detect fast dblclick
        if (Date.now() - self.clicktime < 300) {
            // find topmost gauge
            g = self;
            while (g.parentGauge) {
                g = g.parentGauge;
            }
            event.preventDefault();
            event.cancelBubble = true;
            // in or out
            if (!self.inCloseup) {
                if (self.hidden) {
                    return;
                }
                self.inCloseup = true;
                SC.gaugeInCloseup = g;
                g.container.style.opacity = 0;
                SC.gaugeInCloseupOrigin = g.container.parentElement;
                console.log('closing in');
                // show closeup
                closeup.classList.add('show');
                closeup_container.appendChild(g.container);
                setTimeout(function () {
                    g.resize();
                    g.container.style.opacity = 1;
                }, 300);
                // back button
                SC.gaugeHideCloseup = function () {
                    console.log('closing out by back');
                    self.inCloseup = false;
                    SC.gaugeInCloseupOrigin.appendChild(SC.gaugeInCloseup.container);
                    SC.gaugeInCloseup.resize();
                    closeup.classList.remove('show');
                };
                SC.back.push(SC.gaugeHideCloseup);
            } else {
                self.inCloseup = false;
                console.log('closing out');
                SC.gaugeInCloseupOrigin.appendChild(SC.gaugeInCloseup.container);
                SC.gaugeInCloseup.resize();
                closeup.classList.remove('show');
                // remove back callback1
                SC.back.pop();
            }
        }
        self.clicktime = Date.now();
    }, true);

    self.remove = function () {
        // Remove gauge from parent
        self.container.parentElement.removeChild(self.container);
    };

    self.nuts = function () {
        // return background nut's coordinates
        var aSquare = self.canvas[0].square;
        return {
            x1: aSquare.x + 0.1 * aSquare.w,
            y1: aSquare.y + 0.1 * aSquare.h,
            x2: aSquare.x + 0.9 * aSquare.w,
            y2: aSquare.y + 0.9 * aSquare.h
        };
    };

    self.drawMissingGauge = function (aCanvas, aSquare, aRound) {
        // redraw everything
        var w = aCanvas.w, h = aCanvas.h;
        if (!aRound) {
            self.drawCap(aCanvas.context, 2, 2, w - 4, h - 4);
            self.drawBolt(aCanvas.context, 12, 12, 4);
            self.drawBolt(aCanvas.context, w - 12, 12, 4);
            self.drawBolt(aCanvas.context, w - 12, h - 12, 4);
            self.drawBolt(aCanvas.context, 12, h - 12, 4);
            return;
        }
        // hole for gauge
        self.drawHole(aCanvas.context, aSquare.cx, aSquare.cy, 0.8 * aSquare.cx);
        // screw holes
        h = 0.05 * aSquare.w;
        self.drawHole(aCanvas.context, aSquare.x + 2 * h, aSquare.y + 2 * h, h);
        self.drawHole(aCanvas.context, aSquare.x + aSquare.w - 2 * h, aSquare.y + 2 * h, h);
        self.drawHole(aCanvas.context, aSquare.x + aSquare.w - 2 * h, aSquare.y + aSquare.h - 2 * h, h);
        self.drawHole(aCanvas.context, aSquare.x + 2 * h, aSquare.y + aSquare.h - 2 * h, h);
    };

    self.renderHidden = function () {
        // render itself hidden
        var i, bg = self.canvas[0];
        for (i = 0; i < self.canvas.length; i++) {
            self.canvas[i].clear();
        }
        if (self.hidden) {
            if (self.bg) {
                self.drawMissingGauge(bg, bg.square, self.round);
            }
        }
    };

    self.hide = function (aHidden) {
        // Replace gauge with hole and disable it
        self.hidden = aHidden;
        self.renderHidden();
        if (!self.hidden) {
            self.resize();
        }
    };

    return self;
};



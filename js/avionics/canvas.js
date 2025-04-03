// Canvas (stackable, handle correct sizing, square and few primitives)
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.canvas = function (aParent) {
    // Canvas
    var self = {};
    self.parent = typeof aParent === 'string' ? document.getElementById(aParent) : aParent;
    self.canvas = document.createElement('canvas');
    self.context = self.canvas.getContext('2d');
    self.canvas.style.position = 'absolute';
    self.canvas.style.left = 0;
    self.canvas.style.top = 0;
    self.canvas.style.width = '100%';
    self.canvas.style.height = '100%';
    self.canvas.style.boxSizing = 'border-box';
    self.parent.appendChild(self.canvas);

    self.resize = function () {
        // resize canvas
        self.w = self.canvas.clientWidth;
        self.h = self.canvas.clientHeight;
        self.canvas.width = self.w;
        self.canvas.height = self.h;
        self.full = {x: 0, y: 0, w: self.w, h: self.h};
        var shadow_margin = 2;
        // calculate largest center square
        if (self.w > self.h) {
            // landscape
            self.square = {
                x: (self.w - self.h) / 2,
                y: 0,
                cx: self.w / 2,
                cy: self.h / 2 - shadow_margin,
                w: self.h,
                h: self.h - shadow_margin,
                s: Math.min(self.w, self.h - shadow_margin)
            };
        } else {
            // portrait
            self.square = {
                x: 0,
                y: (self.h - self.w) / 2,
                cx: self.w / 2,
                cy: self.h / 2,
                w: self.w,
                h: self.w,
                s: Math.min(self.w, self.h)
            };
        }
    };
    self.resize();
    window.addEventListener('resize', self.resize);

    self.clear = function () {
        // Clear canvas
        self.context.clearRect(0, 0, self.w, self.h);
    };

    self.line = function (aX1, aY1, aX2, aY2, aColor, aWidth) {
        // draw line
        self.context.strokeStyle = aColor || self.context.strokeStyle;
        self.context.lineWidth = aWidth || self.context.lineWidth;
        self.context.beginPath();
        self.context.moveTo(aX1, aY1);
        self.context.lineTo(aX2, aY2);
        self.context.closePath();
        self.context.stroke();
    };

    self.circle = function (aX, aY, aRadius, aColor, aWidth) {
        // draw circle
        if (aRadius <= 0) {
            return;
        }
        self.context.strokeStyle = aColor || self.context.strokeStyle;
        self.context.fillStyle = aColor || self.context.strokeStyle;
        self.context.lineWidth = aWidth || self.context.lineWidth;
        self.context.beginPath();
        self.context.arc(aX, aY, aRadius, 0, 2 * Math.PI);
        self.context.fill();
    };

    self.cross = function (aX, aY, aColor, aWidth) {
        // draw cross
        self.context.strokeStyle = aColor;
        self.context.lineWidth = aWidth || 31;
        self.context.beginPath();
        self.context.moveTo(aX - 5, aY);
        self.context.lineTo(aX + 5, aY);
        self.context.stroke();
        self.context.beginPath();
        self.context.moveTo(aX, aY - 5);
        self.context.lineTo(aX, aY + 5);
        self.context.stroke();
    };

    self.rectangle = function (aX, aY, aW, aH, aColor, aWidth) {
        // draw rectangle
        self.context.strokeStyle = aColor || self.context.strokeStyle;
        self.context.lineWidth = aWidth || self.context.lineWidth;
        self.context.beginPath();
        self.context.moveTo(aX, aY);
        self.context.lineTo(aX + aW, aY);
        self.context.lineTo(aX + aW, aY + aH);
        self.context.lineTo(aX, aY + aH);
        self.context.closePath();
        self.context.stroke();
    };

    return self;
};

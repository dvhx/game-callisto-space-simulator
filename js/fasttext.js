// Caching text rendering (30-50% speed increase on mobile: 19ms -> 13ms for display)
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.fasttext = (function () {
    var self = {};
    self.items = {};

    self.prepare = function (aLabel, aColor, aFontHeight) {
        // prepare label
        var o = document.createElement('canvas');
        o.context = o.getContext('2d');
        o.context.textBaseline = 'top';
        o.font = aFontHeight + 'px sans-serif';
        o.width = o.context.measureText(aLabel).width;
        o.height = aFontHeight;
        o.context.textBaseline = 'top';
        //o.context.fillStyle = 'red';
        //o.context.fillRect(0, 0, o.width, o.height);
        o.context.fillStyle = aColor;
        o.context.fillText(aLabel, 0, 0);
        self.items[aLabel] = o;
        return o;
    };

    self.draw = function (aContext, aLabel, aX, aY) {
        // fast draw
        aContext.drawImage(self.items[aLabel], aX, aY);
    };

    self.prepareDraw = function (aContext, aLabel, aX, aY, aColor, aFontHeight) {
        // prepare if needed and then draw
        var o = self.items[aLabel];
        if (!o) {
            o = self.prepare(aLabel, aColor, aFontHeight);
        }
        aContext.drawImage(o, aX, aY);
    };

    return self;
}());

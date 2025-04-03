// Rendering 2D top view
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.render2d = (function () {
    var self = {};
    self.panX = 0;
    self.panY = 0;
    self.zoom = 0.005;
    self.frames = 0;
    self.renderTime = 0;
    self.showLabels = true;
    self.centered = null;

    self.center = function (aName) {
        // center view to object
        self.centered = SC.gos.findByName(aName);
    };

    self.render = function (aCanvas) {
        // render solar system from TOP view
        var t = Date.now(), i, w = aCanvas.w, h = aCanvas.h, w2 = w / 2, h2 = h / 2, x, y, r, dr;
        self.frames++;
        aCanvas.context.textBaseline = 'center';
        aCanvas.context.textAlign = 'left';
        if (self.centered) {
            self.panX = -self.zoom * self.centered.pos.elements[0];
            self.panY = -self.zoom * self.centered.pos.elements[1];
        }
        for (i = 0; i < SC.gos.items.length; i++) {
            x = self.panX + w2 + SC.gos.items[i].pos.elements[0] * self.zoom;
            y = self.panY + h2 + SC.gos.items[i].pos.elements[1] * self.zoom;
            r = SC.gos.items[i].radius * self.zoom;
            SC.gos.items[i].screen = [x, y];
            SC.gos.items[i].screenWidth = 2 * r;
            if (r < 1) {
                aCanvas.cross(x, y, SC.gos.items[i].color, 1);
            } else {
                aCanvas.circle(x, y, SC.gos.items[i].radius * self.zoom, SC.gos.items[i].color);
            }
            if (self.showLabels) {
                aCanvas.context.fillStyle = SC.gos.items[i].color;
                aCanvas.context.fillText(SC.gos.items[i].name, x + r + 2, y);
            }
            // for objects with rot also display direction
            if (SC.gos.items[i].rot) {
                // gravitation = green
                dr = Vector.create([x, y, 0]).add(SC.gos.items[i].fgm.toUnitVector().multiply(30));
                aCanvas.line(x, y, dr.elements[0], dr.elements[1], 'green');
                // direction = dew (blue)
                dr = Vector.create([x, y, 0]).add(SC.gos.items[i].dir.multiply(30));
                aCanvas.line(x, y, dr.elements[0], dr.elements[1], 'orange');
                // speed = silver
                dr = Vector.create([x, y, 0]).add(SC.gos.items[i].speed.toUnitVector().multiply(30));
                aCanvas.line(x, y, dr.elements[0], dr.elements[1], 'silver');
            }
        }
        self.renderTime += Date.now() - t;
    };

    return self;
}());


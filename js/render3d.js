// Rendering 3D view
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.render3d = (function () {
    var self = {};
    self.frames = 0;
    self.renderTime = 0;
    self.showLabels = true;
    self.zoom = 1;

    self.findTarget = function (aFrom, aOnlyLidarable) {
        // Find target closest to the center of screen
        var i, d, p, m = 1e9, t, up = aFrom.up(), dist = 1e30;
        for (i = 0; i < SC.gos.items.length; i++) {
            if (aFrom !== SC.gos.items[i] && (!aOnlyLidarable || (aOnlyLidarable && SC.gos.items[i].lidarable === true))) {
                // perspective transformation
                p = SC.perspective(aFrom.pos, aFrom.dir, aFrom.right, up, SC.gos.items[i].pos);
                d = p[0] * p[0] + p[1] * p[1];
                if (d < m) {
                    m = d;
                    t = SC.gos.items[i];
                    dist = p[2];
                    console.log(t.name, m, dist);
                }
            }
        }
        return {target: t, distance: dist};
    };

    self.render = function (aCanvas, aFrom) {
        // render solar system from players view
        var i, up, p, w = aCanvas.w, h = aCanvas.h,
            w2 = w / 2, h2 = h / 2, wh2 = (w + h) / 2, x, y, d, s;
        self.frames++;
        self.modelsRendered = 0;
        up = aFrom.up();
        // cache camera
        SC.perspectiveCache(aFrom.pos, aFrom.dir, aFrom.right, up);
        // all go
        for (i = 0; i < SC.gos.items.length; i++) {
            if (aFrom !== SC.gos.items[i]) {
                // perspective transformation
                p = SC.perspective(aFrom.pos, aFrom.dir, aFrom.right, up, SC.gos.items[i].pos);
                if (p.length === 0) {
                    continue;
                }
                // check if it fits the screen
                // NOTE: i render more than what is on screen because planets would
                // disappear just after their center would fall of screen, I show
                // objects up to Fx screen size
                if (!SC.gos.items[i].renderAlways) {
                    if (p[0] < -3 || p[0] > 3 || p[1] < -3 || p[1] > 3) {
                        continue;
                    }
                }
                // don't render beyond certain distance
                if (p[2] >= SC.gos.items[i].maxRenderDistance) {
                    continue;
                }
                // size depends on distance and real size
                d = p[2];
                s = wh2 * (SC.gos.items[i].radius / d);
                x = w2 + self.zoom * wh2 * p[0];
                y = h2 + self.zoom * wh2 * p[1];
                // render as circle, dot or model
                aCanvas.context.fillStyle = SC.gos.items[i].color;
                if (SC.gos.items[i].model) {
                    if (s > 0.5) {
                        if (d < SC.gos.items[i].maxModelRenderDistance) {
                            SC.model.render(aCanvas, aFrom, SC.gos.items[i], self.zoom);
                            self.modelsRendered++;
                        } else {
                            aCanvas.circle(x, y, self.zoom * s, SC.gos.items[i].color, 1);
                        }
                    } else {
                        aCanvas.context.fillStyle = SC.gos.items[i].color;
                        aCanvas.context.fillRect(x - 1, y - 1, 2, 2);
                    }
                } else {
                    if (s < 2) {
                        aCanvas.context.fillStyle = SC.gos.items[i].color;
                        aCanvas.context.fillRect(x - 1, y - 1, 2, 2);
                    } else {
                        aCanvas.circle(x, y, self.zoom * s, SC.gos.items[i].color, 1);
                    }
                }
                // render label
                if (SC.gos.items[i].name) {
                    if (!SC.gos.items[i].labelMaxDistance || d < SC.gos.items[i].labelMaxDistance) {
                        SC.fasttext.draw(aCanvas.context, SC.gos.items[i].name, x + s + 2, y);
                    }
                }
            }
        }
    };

    return self;
}());


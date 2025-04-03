// Wire frame model rendering
"use strict";
// globals: window

var SC = window.SC || {};

SC.model = (function () {
    // Model renderer
    var self = {};

    self.dimensions = function (aModel) {
        // return dimensions of the model
        var i, minx = Number.MAX_VALUE, miny = Number.MAX_VALUE,
            minz = Number.MAX_VALUE, maxx = -Number.MAX_VALUE, maxy = -Number.MAX_VALUE, maxz = -Number.MAX_VALUE;
        for (i = 0; i < aModel.vertices.length; i++) {
            minx = Math.min(minx, aModel.vertices[i].elements[0]);
            miny = Math.min(miny, aModel.vertices[i].elements[1]);
            minz = Math.min(minz, aModel.vertices[i].elements[2]);
            maxx = Math.max(maxx, aModel.vertices[i].elements[0]);
            maxy = Math.max(maxy, aModel.vertices[i].elements[1]);
            maxz = Math.max(maxz, aModel.vertices[i].elements[2]);
        }
        return {
            minx: minx,
            maxx: maxx,
            miny: miny,
            maxy: maxy,
            minz: minz,
            maxz: maxz,
            sizex: maxx - minx,
            sizey: maxy - miny,
            sizez: maxz - minz,
            size: Math.max(maxx - minx, maxy - miny, maxz - minz)
        };
    };

    self.scale = function (aModel, aScale) {
        // return copy of uniformly scaled model
        var i, m = { vertices: [], lines: [] }, dim;
        // find dimensions of the model
        dim = self.dimensions(aModel);
        // scale vertices
        for (i = 0; i < aModel.vertices.length; i++) {
            m.vertices.push(aModel.vertices[i].multiply(aScale / dim.size));
        }
        // copy lines
        for (i = 0; i < aModel.lines.length; i++) {
            m.lines.push([aModel.lines[i][0], aModel.lines[i][1]]);
        }
        return m;
    };

    self.render = function (aCanvas, aCamera, aTarget, aZoom) {
        // render aModel in aTarget position as seen from aCamera
        // transpose vertices of a model into target's position and orientation
        var i, vertices = [], v, camera_up = aCamera.up(), target_up = aTarget.up(),
            model = SC.modelData[aTarget.model], a, b, w2 = aCanvas.w / 2, h2 = aCanvas.h / 2, wh2 = (aCanvas.w + aCanvas.h) / 2,
            s = aTarget.radius;
        for (i = 0; i < model.vertices.length; i++) {
            // copy original point
            v = model.vertices[i];
            // transpose dir/right/up
            v = aTarget.pos.add(aTarget.dir.multiply(v.elements[0] * s)).add(aTarget.right.multiply(v.elements[1] * s)).add(target_up.multiply(v.elements[2] * s));
            // perspective
            vertices[i] = SC.perspective(aCamera.pos, aCamera.dir, aCamera.right, camera_up, v);
            vertices[i][0] = w2 + aZoom * wh2 * vertices[i][0];
            vertices[i][1] = h2 + aZoom * wh2 * vertices[i][1];
        }
        // render lines
        aCanvas.context.lineWidth = 1;
        aCanvas.context.strokeStyle = aTarget.aColor || 'white';
        for (i = 0; i < model.lines.length; i++) {
            if (model.lines[i][2] === false) {
                continue;
            }
            a = vertices[model.lines[i][0]];
            b = vertices[model.lines[i][1]];
            aCanvas.context.beginPath();
            aCanvas.context.moveTo(a[0], a[1]);
            aCanvas.context.lineTo(b[0], b[1]);
            aCanvas.context.stroke();
        }
    };

    return self;
}());



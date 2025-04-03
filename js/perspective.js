// Perspective projection using near plane, point-plane distances and angles
// It's very suboptimal code but the one from wikipedia didn't worked
"use strict";
// globals: window, Plane, Line

var SC = window.SC || {};

SC.perspectiveNear = null;
SC.perspectivePlaneR = null;
SC.perspectivePlaneUp = null;

SC.perspectiveCache = function (aCameraPos, aCameraFront, aCameraRight, aCameraUp) {
    // Cache few variable common for all objects
    SC.perspectiveNear = Plane.create(aCameraPos.add(aCameraFront), aCameraFront);
    SC.perspectivePlaneR = Plane.create(aCameraPos, aCameraRight);
    SC.perspectivePlaneUp = Plane.create(aCameraPos, aCameraUp);
};

SC.perspective = function (aCameraPos, aCameraFront, aCameraRight, aCameraUp, aPoint) {
    // Transform single point from 3d to 2d perspective projection
    // ignore if eye is in that point
    if (aPoint.elements[0] === aCameraPos.elements[0] && aPoint.elements[1] === aCameraPos.elements[1] && aPoint.elements[2] === aCameraPos.elements[2]) {
        return [];
    }
    // Calculate 3D to 2D projection
    var s, sline, nbod, alpha, beta, gamma, ax, ay, sd;
    // vector from eye to point
    s = aPoint.subtract(aCameraPos);
    sd = s.modulus();
    s = s.toUnitVector();
    // line from eye to point
    sline = Line.create(aCameraPos, s);
    // intersection of sline and near plane
    nbod = SC.perspectiveNear.intersectionWith(sline);
    if (!nbod || !SC.perspectivePlaneR) {
        return [];
    }
    // ax = distance nbod to that plane
    ax = SC.perspectivePlaneR.distanceFrom(nbod);
    // ay = distance nbod to that plane
    ay = SC.perspectivePlaneUp.distanceFrom(nbod);
    // angles
    // alpha is dir to s (used to detect if I look the same direction)
    alpha = aCameraFront.angleFrom(s);
    if (alpha > Math.PI / 2) {
        return [];
    }
    // beta is from right to s
    beta = aCameraRight.angleFrom(s);
    // if beta > 90 then ax is on the left
    if (beta > Math.PI / 2) {
        ax = -ax;
    }
    // gamma is angle to up
    gamma = aCameraUp.angleFrom(s);
    // if gamma > 90 then ay is on the down? up?
    if (gamma > Math.PI / 2) {
        ay = -ay;
    }
    return [ax, ay, sd];
};


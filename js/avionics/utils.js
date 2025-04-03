// Various functions for avionics
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.path = ''; // where to load sounds and images from

SC.hhmmss = function (aSeconds) {
    // convert seconds to HH:MM:SS
    var t = Math.abs(Math.round(aSeconds)), sec, min, hrs;
    sec = t % 60;
    t -= sec;
    min = Math.floor(t / 60) % 60;
    t -= min * 60;
    hrs = t / 3600;
    return (hrs <= 99 ? ('0' + hrs).substr(-2) : hrs) + ':' + ('0' + min).substr(-2) + ':' + ('0' + sec).substr(-2);
};

SC.getAbsolutePosition = function (aElement, aEvent) {
    // get absolute position of an element or event
    var x = 0, y = 0, sx, sy;
    while (aElement) {
        if (aElement.tagName === "BODY") {
            sx = aElement.scrollLeft || document.documentElement.scrollLeft;
            sy = aElement.scrollTop || document.documentElement.scrollTop;
            x += (aElement.offsetLeft - sx + aElement.clientLeft);
            y += (aElement.offsetTop - sy + aElement.clientTop);
        } else {
            x += (aElement.offsetLeft - aElement.scrollLeft + aElement.clientLeft);
            y += (aElement.offsetTop - aElement.scrollTop + aElement.clientTop);
        }
        aElement = aElement.offsetParent;
    }
    if (aEvent) {
        return {x: aEvent.offsetX, y: aEvent.offsetY}; //{x: aEvent.clientX - x, y: aEvent.clientY - y};
    }
    return {x: x, y: y};
};

SC.radToDeg = function (aRadians) {
    // convert radians to degrees
    return aRadians * 180 / Math.PI;
};

SC.degToRad = function (aDegrees) {
    // convert degrees to radians
    return Math.PI * aDegrees / 180;
};

SC.outline = function (aElementOrId, aTop, aRight, aBottom, aLeft) {
    // Outline gauge in training missions
    var e = typeof aElementOrId === 'string' ? document.getElementById(aElementOrId) : aElementOrId;
    e.style.borderTop = aTop ? '2px dashed lime' : '';
    e.style.borderRight = aRight ? '2px dashed lime' : '';
    e.style.borderBottom = aBottom ? '2px dashed lime' : '';
    e.style.borderLeft = aLeft ? '2px dashed lime' : '';
    setTimeout(function () {
        e.style.borderTop = aTop ? '2px dashed red' : '';
        e.style.borderRight = aRight ? '2px dashed red' : '';
        e.style.borderBottom = aBottom ? '2px dashed red' : '';
        e.style.borderLeft = aLeft ? '2px dashed red' : '';
    }, 500);
    setTimeout(function () {
        e.style.borderTop = aTop ? '2px dashed lime' : '';
        e.style.borderRight = aRight ? '2px dashed lime' : '';
        e.style.borderBottom = aBottom ? '2px dashed lime' : '';
        e.style.borderLeft = aLeft ? '2px dashed lime' : '';
    }, 1000);
};

SC.outlineFlash = function (aElementOrId, aTop, aRight, aBottom, aLeft) {
    // Shortly outline element
    SC.outline(aElementOrId, aTop, aRight, aBottom, aLeft);
    setTimeout(function () {
        SC.outline(aElementOrId);
    }, 500);
};

SC.shuffleArray = function (aArray) {
    // randomly shuffle array
    var i, j, temp;
    for (i = aArray.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = aArray[i];
        aArray[i] = aArray[j];
        aArray[j] = temp;
    }
    return aArray;
};

SC.humanDistance = function (aMeters) {
    // return human readable distance
    if (aMeters < 10) {
        return aMeters.toFixed(2) + 'm';
    }
    if (aMeters < 100) {
        return aMeters.toFixed(1) + 'm';
    }
    if (aMeters < 10000) {
        return aMeters.toFixed(0) + 'm';
    }
    if (aMeters < 100000) {
        return (aMeters / 1000).toFixed(2) + 'km';
    }
    if (aMeters < 1000000) {
        return (aMeters / 1000).toFixed(1) + 'km';
    }
    return (aMeters / 1000).toFixed(0) + 'km';
};

SC.humanSpeed = function (aMetersPerSecond) {
    // return human readable speed
    if (aMetersPerSecond < 10) {
        return aMetersPerSecond.toFixed(2) + 'm/s';
    }
    if (aMetersPerSecond < 100) {
        return aMetersPerSecond.toFixed(1) + 'm/s';
    }
    if (aMetersPerSecond < 10000) {
        return aMetersPerSecond.toFixed(0) + 'm/s';
    }
    if (aMetersPerSecond < 100000) {
        return (aMetersPerSecond / 1000).toFixed(2) + 'km/s';
    }
    if (aMetersPerSecond < 1000000) {
        return (aMetersPerSecond / 1000).toFixed(1) + 'km/s';
    }
    return (aMetersPerSecond / 1000).toFixed(0) + 'km/s';
};

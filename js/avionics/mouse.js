// Proper mouse support for gauges (gauges will receive events even while mouse is out of gauge if it is still pressed)
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.mouse = (function () {
    var self = {}, key = 0;
    self.gauges = {};
    self.current = null;

    self.register = function (aGauge) {
        //if (!aGauge.abs) {
        //    console.warn('gauge has no abs', aGauge);
        //}
        if (!aGauge.onMouseDown) {
            console.warn('gauge has no onMouseDown', aGauge);
        }
        if (!aGauge.onMouseMove) {
            console.warn('gauge has no onMouseMove', aGauge);
        }
        if (!aGauge.onMouseUp) {
            console.warn('gauge has no onMouseUp', aGauge);
        }
        key++;
        aGauge.container.dataMouseKey = key;
        self.gauges[key] = aGauge;
    };

    function findGaugeByContainer(aContainer) {
        // Find if this container belongs to any gauge
        var k;
        if (aContainer.dataMouseKey) {
            //console.log('index search for', aContainer);
            return self.gauges[aContainer.dataMouseKey];
        }
        //console.log('sequential search for', aContainer);
        for (k in self.gauges) {
            if (self.gauges.hasOwnProperty(k)) {
                if (self.gauges[k].container === aContainer) {
                    aContainer.dataMouseKey = k;
                    return self.gauges[k];
                }
            }
        }
    }

    window.addEventListener('mousedown', function (event) {
        // find if it is gauge
        var ev = event, p = event.target, g;
        if (p.nodeName !== 'CANVAS') {
            return;
        }
        function pd() {
            ev.preventDefault();
        }
        while (p) {
            if (p.classList.contains('gauge_container')) {
                g = findGaugeByContainer(p);
                if (g) {
                    self.current = g;
                    //console.log('found gauge', g);
                    self.current.onMouseDown({
                        target: self.current,
                        clientX: event.clientX,
                        clientY: event.clientY,
                        which: event.which,
                        preventDefault: pd
                    });
                    //console.log('mousedown', self.current, event.target, event.clientX, event.clientY);
                    return;
                }
            }
            p = p.parentElement;
            //console.log('p', p);
        }
        //console.log('mousedown', self.current, event.target, event.clientX, event.clientY);
    }, true);

    window.addEventListener('mousemove', function (event) {
        var ev = event;
        if (self.current) {
            self.current.onMouseMove({
                target: self.current,
                clientX: event.clientX,
                clientY: event.clientY,
                which: event.which,
                preventDefault: function () { ev.preventDefault(); }
            });
        }
    }, true);

    window.addEventListener('mouseup', function (event) {
        var ev = event;
        if (self.current) {
            self.current.onMouseUp({
                target: self.current,
                clientX: event.clientX,
                clientY: event.clientY,
                which: event.which,
                preventDefault: function () { ev.preventDefault(); }
            });
            self.current = null;
        }
    }, true);

    return self;
}());


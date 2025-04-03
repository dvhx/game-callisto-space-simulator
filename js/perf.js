// Performance monitoring
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.perf = (function () {
    var self = {};
    self.block = {};

    self.begin = function (aBlock) {
        // Start the measuring of a block
        self.block[aBlock] = self.block[aBlock] || {
            frames: 0,
            time: 0
        };
        self.block[aBlock].begin = Date.now();
    };

    self.end = function (aBlock) {
        // End the measuring of a block
        self.block[aBlock].frames++;
        self.block[aBlock].time += Date.now() - self.block[aBlock].begin;
        delete self.block[aBlock].begin;
        self.block[aBlock].avg = self.block[aBlock].time / self.block[aBlock].frames;
    };

    self.clear = function (aBlock) {
        // Clear one block
        self.block[aBlock].frames = 0;
        self.block[aBlock].time = 0;
        self.block[aBlock].avg = 0;
    };

    self.show = function () {
        // Show stats
        var k, a = [], o;
        for (k in self.block) {
            if (self.block.hasOwnProperty(k)) {
                o = JSON.parse(JSON.stringify(self.block[k]));
                o.block = k;
                a.push(o);
            }
        }
        a.sort(function (a, b) { return b.time - a.time; });
        a = a.map(function (a) { return 't=' + a.time + 'ms (avg ' + a.avg.toFixed(3) + 'ms) ' + a.frames + ' frames - ' + a.block; });
        a = a.join('\n');
        alert(a);
        self.block = {};
    };

    return self;
}());


// Handle back button correctly in various situations
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.back = (function () {
    var self = {};
    self.items = [];

    self.onBack = function () {
        // User press back button
        console.log('onBack');
        /*
        var i;
        for (i = 0; i < self.items.length; i++) {
            console.log('[' + i + ']: ' + self.items[i]);
        }
        */
        // pop last item
        var f = self.pop();
        // execute it
        if (f) {
            f();
        } else {
            console.log('no back');
        }
    };
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            SC.back.onBack();
        }
    });

    self.push = function (aCallback) {
        // add new callback to back stack
        self.items.push(aCallback);
    };

    self.pop = function () {
        // pop last callback from back stack
        var f = self.items.pop();
        if (self.items.length <= 0) {
            self.items.push(f);
        }
        return f;
    };

    return self;
}());

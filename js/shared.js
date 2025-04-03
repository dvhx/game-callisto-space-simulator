// Reimplementing mobile app's shared data features for the normal browser using local storage
// linter: ngspicejs-lint
// global: window
"use strict";

var SC = window.SC || {};

SC.shared = (function () {
    var self = {};

    self.set = function (aString) {
        // Write shared data
        SC.storage.writeString('CA_SHARED', aString);
    };

    self.get = function () {
        // Read shared data
        return SC.storage.readString('CA_SHARED', '');
    };

    return self;
}());

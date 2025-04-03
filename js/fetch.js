// Fetch text from server
"use strict";
// linter: ngspicejs-lint
// global: window, fetch

var SC = window.SC || {};

SC.fetch = function (aUrl, aCallback) {
    // fetch text from server
    fetch(aUrl).then((response) => response.text()).then(aCallback);
};
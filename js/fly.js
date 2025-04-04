// Main window
"use strict";
// globals: window, document, setTimeout, requestAnimationFrame

var SC = window.SC || {};

SC.abortDialog = function () {
    // Ask user if really abort mission
    // return
    var s = SC.splash('Abort mission?', ['Abort mission', 'Continue mission'], 'pink', 'Are you sure you want to abort this mission and return to pinboard?', function (aButton) {
        if (aButton === 'Abort mission') {
            document.location = 'index.html';
        }
    }, '60vw', 'auto');
    s.bgClickDisable();
};

SC.normalStart = function () {
    // Start without parameters
    SC.flyInit(undefined);
};

// initialize window
window.addEventListener('DOMContentLoaded', function () {
    if (window.innerWidth < window.innerHeight) {
        SC.showToast('This game can only be played in landscape mode!');
    }
    // mobile start requires touch to activate fullscreen and orientation lock
    SC.normalStart();
});


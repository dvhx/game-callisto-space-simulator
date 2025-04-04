/// Return true if device has touch screen (to show touchpad)
"use strict";
// global: window, navigator, document, alert, console
// linter: ngspicejs-lint

var SC = window.SC || {};

SC.isTouchDevice = function () {
    // Return true if device has touch screen (to show touchpad)
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

SC.fullscreen = function () {
    // Enter fullscreen mode
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
};

SC.landscape = function () {
    // Force landscape mode
    if (window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape").catch(function (error) {
            console.error("Orientation lock failed: " + error);
            //alert("Orientation lock failed: " + error);
        });
    } else {
        console.error("Screen Orientation API is not supported or not allowed.");
        //alert("Screen Orientation API is not supported or not allowed.");
    }
};

SC.fullscreenAndLandscape = function () {
    // Turn on fullscreen, then landscape, then hide dialog and show iframe
    SC.fullscreen();
    window.requestAnimationFrame(function () {
        SC.landscape();
        window.requestAnimationFrame(function () {
            var dlg = document.getElementById('dlg');
            var ifr = document.getElementById('ifr');
            if (dlg) {
                dlg.close();
            }
            if (ifr) {
                ifr.style.display = 'block';
            }
        });
    });
};


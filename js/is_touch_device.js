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

SC.fixMobile = function (aCallback) {
    // set fullscreen and lock orientation on mobile
    if (SC.storage.readBoolean('SC.dontFixMobile', false)) {
        aCallback();
        return;
    }
    if (!SC.isTouchDevice()) {
        aCallback();
        return;
    }
    if (document.fullscreenElement) {
        aCallback();
        return;
    }
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = 0;
    div.style.top = 0;
    div.style.right = 0;
    div.style.bottom = 0;
    div.style.backgroundImage = 'url(image/brushed_metal.png)';
    div.style.zIndex = 1000000;
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.color = 'white';
    div.textContent = 'Tap anywhere to enable fullscreen+landscape mode';
    document.body.appendChild(div);
    div.onclick = function () {
        div.parentElement.removeChild(div);
        SC.fullscreen();
        window.requestAnimationFrame(function () {
            SC.landscape();
            window.requestAnimationFrame(aCallback);
        });
    };
};

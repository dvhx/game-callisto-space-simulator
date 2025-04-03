// Originally this was only for touch screen but with desktop WASD and NUMPAD controls were added
// linter: ngspicejs-lint
// global: window, document
"use strict";

var SC = window.SC || {};

SC.keys = {};

SC.keyboardInit = function () {

    window.addEventListener('keydown', function (event) {
        // key pressed
        var key = event.key;
        SC.keys[event.keyCode] = true;
        SC.keys[event.key] = true;
        var r, p, t, f;
        // orto
        if (key === 'o') {
            SC.panel.buttons.orto.button.click();
        }
        // S/10
        if (key === 'i') {
            SC.panel.buttons.s10.button.click();
        }
        // roll
        if (SC.panel.roll.enabled && !SC.panel.roll.broken) {
            if (key === 'q') {
                SC.panel.roll.state.value = -1;
                r = true;
            }
            if (key === 'e') {
                SC.panel.roll.state.value = 1;
                r = true;
            }
        }
        // pan
        if (SC.panel.pan.enabled && !SC.panel.pan.broken) {
            if (key === 'a' && SC.panel.orto !== 2) {
                SC.panel.pan.state.x = -SC.panel.pan.sensitivity;
                p = true;
            }
            if (key === 'd' && SC.panel.orto !== 2) {
                SC.panel.pan.state.x = SC.panel.pan.sensitivity;
                p = true;
            }
            if (key === 'w' && SC.panel.orto !== 1) {
                SC.panel.pan.state.y = -SC.panel.pan.sensitivity;
                p = true;
            }
            if (key === 's' && SC.panel.orto !== 1) {
                SC.panel.pan.state.y = SC.panel.pan.sensitivity;
                p = true;
            }
        }
        // thrust
        if (SC.panel.thrust.enabled && !SC.panel.thrust.broken) {
            if (key === 'ArrowLeft' && SC.panel.orto !== 2) {
                SC.panel.thrust.state.x = -SC.panel.thrust.sensitivity;
                t = true;
            }
            if (key === 'ArrowRight' && SC.panel.orto !== 2) {
                SC.panel.thrust.state.x = SC.panel.thrust.sensitivity;
                t = true;
            }
            if (key === 'ArrowUp' && SC.panel.orto !== 1) {
                SC.panel.thrust.state.y = -SC.panel.thrust.sensitivity;
                t = true;
            }
            if (key === 'ArrowDown' && SC.panel.orto !== 1) {
                SC.panel.thrust.state.y = SC.panel.thrust.sensitivity;
                t = true;
            }
        }
        // forward back
        if (SC.panel.fb.enabled && !SC.panel.fb.broken) {
            if (key === 'f') {
                SC.panel.fb.state.value = -1;
                f = true;
            }
            if (key === 'b') {
                SC.panel.fb.state.value = 1;
                f = true;
            }
        }
        // render
        if (r) {
            SC.panel.roll.render();
        }
        if (p) {
            SC.panel.pan.render();
        }
        if (t) {
            SC.panel.thrust.render();
        }
        if (f) {
            SC.panel.fb.render();
        }
    });

    window.addEventListener('keyup', function (event) {
        // key released
        SC.keys[event.keyCode] = false;
        SC.keys[event.key] = false;
        var r;
        // roll
        if (!SC.keys.q && !SC.keys.e) {
            SC.panel.roll.state.value = 0;
            SC.panel.roll.render();
        }
        // pan
        r = false;
        if (!SC.keys.a && !SC.keys.d) {
            SC.panel.pan.state.x = 0;
            r = true;
        }
        if (!SC.keys.w && !SC.keys.s) {
            SC.panel.pan.state.y = 0;
            r = true;
        }
        if (r) {
            SC.panel.pan.render();
        }
        // thrust
        r = false;
        if (!SC.keys.ArrowLeft && !SC.keys.ArrowRight) {
            SC.panel.thrust.state.x = 0;
            r = true;
        }
        if (!SC.keys.ArrowUp && !SC.keys.ArrowDown) {
            SC.panel.thrust.state.y = 0;
            r = true;
        }
        if (r) {
            SC.panel.thrust.render();
        }
        // forward back
        r = false;
        if (!SC.keys.f && !SC.keys.b) {
            SC.panel.fb.state.value = 0;
            r = true;
        }
        if (r) {
            SC.panel.fb.render();
        }
    });

};



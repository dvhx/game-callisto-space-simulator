// Push button component with back light and click sounds
"use strict";
// globals: window, document

var SC = window.SC || {};

SC.button = function (aParent, aLabel, aColor, aLight, aCallback, aAuto) {
    // Push button with back light
    var self = {}, onTime = 0;

    self.auto = aAuto;
    self.broken = false;
    self.parent = typeof aParent === 'string' ? document.getElementById(aParent) : aParent;

    self.div = document.createElement('div');
    self.div.style.position = 'relative';

    self.button = document.createElement('button');
    self.button.innerText = aLabel;
    self.button.classList.add('push');

    self.soundOn = document.createElement('audio');
    self.soundOn.src = SC.path + 'sound/toggle_switch_on.ogg';
    self.soundOff = document.createElement('audio');
    self.soundOff.src = SC.path + 'sound/toggle_switch_off.ogg';

    self.break = function (aBroken) {
        // Break button
        self.light(false);
        self.broken = aBroken;
    };

    self.hide = function (aHidden) {
        // Hide button (leave hole)
        self.hidden = aHidden;
        if (aHidden) {
            self.button.style.color = 'transparent';
            self.button.style.backgroundColor = 'black';
            self.button.style.boxShadow = '0 0 black';
            self.button.disabled = true;
        } else {
            self.button.style.color = '';
            self.button.style.backgroundColor = '';
            self.button.style.boxShadow = '';
            self.button.disabled = false;
        }
    };

    self.gone = function (aGone) {
        // Hide button completely
        self.hidden = aGone;
        if (aGone) {
            self.button.style.display = 'none';
        } else {
            self.button.style.display = '';
        }
    };

    self.color = function (aColor) {
        // return color or set it
        var old_color = self.button.classList.toString().match(/red|green|blue|white|yellow|pink/);
        old_color = old_color && old_color[0];
        if (aColor === undefined) {
            return old_color;
        }
        if (['red', 'green', 'blue', 'white', 'yellow', 'pink'].indexOf(aColor) < 0) {
            throw 'Unsupported color "' + aColor + '"';
        }
        self.button.classList.remove(old_color);
        self.oldColor = aColor;
        self.button.classList.add(aColor);
    };
    self.color(aColor);

    self.light = function (aLight) {
        // return state of light or set it
        if (aLight === undefined) {
            return self.button.classList.contains('on');
        }
        if (self.broken) {
            return;
        }
        if (aLight) {
            self.button.classList.add('on');
        } else {
            self.button.classList.remove('on');
        }
    };
    self.light(aLight);

    function playOnSound(event) {
        // play on sound
        if (event.timeStamp - onTime < 300) {
            return;
        }
        onTime = event.timeStamp;
        self.soundOn.currentTime = 0;
        self.soundOn.play();
    }

    function onClick() {
        // handle auto light and call callback
        if (aAuto) {
            self.light(!self.button.classList.contains('on'));
        }
        if (self.broken) {
            return;
        }
        // play off sound
        self.soundOff.currentTime = 0;
        self.soundOff.play();
        // callback
        if (aCallback) {
            aCallback(self.button.classList.contains('on'), self);
        }
    }

    self.button.addEventListener('mousedown', playOnSound);
    self.button.addEventListener('touchstart', playOnSound);
    self.button.addEventListener('click', onClick, true);

    self.parent.appendChild(self.button);

    return self;
};


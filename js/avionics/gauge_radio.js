// Radio receiver
"use strict";
// globals: window, document, setTimeout, Vector
var SC = window.SC || {};

SC.gaugeRadio = function (aParent) {
    var self = SC.gauge(aParent, 'bg'), ang = 2 * Math.PI, tuning = false;
    self.updateInterval = 0.5;

    self.state = {
        ship: Vector.create([0, 0, 0]),
        forward: Vector.create([0, 1, 0]),
        sources: {
            '495MHz': Vector.create([0, 11, 3]),
            '513MHz': Vector.create([12, -34, -56])
        }
    };

    self.container.className = 'black_lcd';
    //self.container.style.display = 'block';
    self.container.id = 'radio_container';

    // sounds
    self.soundTunning = document.createElement('audio');
    self.soundTunning.src = SC.path + 'sound/radio_tunning.ogg';
    self.soundNoise = document.createElement('audio');
    self.soundNoise.src = SC.path + 'sound/radio_noise.ogg';
    self.soundNoise.loop = true;
    self.soundNoiseQuiet = document.createElement('audio');
    self.soundNoiseQuiet.src = SC.path + 'sound/radio_noise_quiet.ogg';
    self.soundNoiseQuiet.loop = true;
    self.soundBeep = document.createElement('audio');
    self.soundBeep.src = SC.path + 'sound/radio_beep.ogg';
    self.soundBeep.loop = true;

    self.onBandChange = function (aBandState) {
        // update radio after knob change
        if (aBandState.value === 0) {
            self.soundNoise.pause();
            self.soundTunning.pause();
            self.soundNoiseQuiet.pause();
            self.soundBeep.pause();
            self.freq.enable(false);
            self.angle.enable(false);
        } else {
            self.soundNoise.play();
            self.freq.enable(true);
            self.angle.enable(true);
        }
        self.key = self.freq.state.value + self.band.state.valueLabel;
        self.update(self.state, true);
    };

    self.onFreqChange = function () {
        // update radio after knob change
        if (self.band.state.value === 0) {
            return;
        }
        // start tuning sound
        if (!tuning) {
            tuning = true;
            setTimeout(function () {
                tuning = false;
                self.soundTunning.pause();
            }, 500);
            self.soundTunning.play();
        }
        self.key = self.freq.state.value + self.band.state.valueLabel;
        self.update(self.state, true);
    };

    self.onAngleChange = function (aAngleState) {
        // update angle
        ang = Math.PI * aAngleState.value / 180;
        self.update(self.state, true);
    };

    self.update = function (aState, aForceRedraw) {
        // update changing stuff
        if (!self.enabled || self.hidden || self.broken) {
            return;
        }
        if (!aForceRedraw && !self.changed(aState)) {
            return;
        }
        if (self.band.value === 0) {
            return;
        }
        // if source is within angle play it
        var sa, src, s;
        if (aState.sources.hasOwnProperty(self.key)) {
            src = aState.sources[self.key];
            // vector from ship to src
            s = src.pos.subtract(aState.ship);
            // get angle from forward to source
            sa = aState.forward.angleFrom(s);
            if (sa < ang) {
                self.soundBeep.play();
                self.soundBeep.volume = 1 - 0.5 * (sa / ang);
                self.receivingStation = self.key;
                self.receivingVolume = self.soundBeep.volume;
                self.soundNoise.volume = 0.1;
            } else {
                self.soundBeep.pause();
                self.soundNoise.volume = 0.1;
                self.receivingStation = '';
                self.receivingVolume = 0;
            }
        } else {
            self.soundBeep.pause();
            self.soundNoise.volume = 1;
            self.receivingStation = '';
            self.receivingVolume = 0;
        }

        // remember new state
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        if (self.enabled) {
            self.band.resize();
            self.band.render();
            self.freq.resize();
            self.freq.render();
            self.angle.resize();
            self.angle.render();
        }
        self.update(self.state, true);
        self.renderCount++;
    };

    self.band = SC.gaugeLcdKnob(self.container, 'Band', 3, 0, 0, 3, self.onBandChange);
    self.band.container.style.height = '33.33%'; // workaround
    self.band.state.valueLabels = {
        0: 'off',
        1: 'kHz',
        2: 'MHz',
        3: 'GHz'
    };
    self.band.update(self.band.state, true);
    self.band.callback = self.onBandChange;

    self.freq = SC.gaugeLcdKnob(self.container, 'Freq', 3, 500, 1, 999, self.onFreqChange);
    self.freq.container.style.height = '33.33%'; // workaround
    self.freq.enable(false);
    self.angle = SC.gaugeLcdKnob(self.container, 'Angle', 3, 360, 1, 360, self.onAngleChange);
    self.angle.container.style.height = '33.33%'; // workaround
    self.angle.enable(false);

    self.add(self.band);
    self.add(self.freq);
    self.add(self.angle);

    self.render();

    self.hideOrig = self.hide;
    self.hide = function (aHidden) {
        // hide and also knobs
        self.hideOrig(aHidden);
        self.band.hide(aHidden);
        self.freq.hide(aHidden);
        self.angle.hide(aHidden);
        if (aHidden) {
            self.container.classList.remove('black_lcd');
        } else {
            self.container.classList.add('black_lcd');
        }
    };

    return self;
};


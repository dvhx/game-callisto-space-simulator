// Sounds and voices
"use strict";
// globals: window, document, setTimeout

var SC = window.SC || {};

SC.sound = (function () {
    var self = {};

    self.create = function (aName) {
        // create one sound
        var s = document.createElement('audio');
        s.src = 'sound/' + aName + '.ogg';
        return s;
    };

    self.beep = self.create('beep');

    self.say = function (aText, aBeep) {
        // say predefined messages
        if (aBeep) {
            self.beep.play();
        }
        setTimeout(function () {
            var fn = aText.toLowerCase().replace(/[ ,\.!]/g, '_'),
                s = self.create('espeak/' + fn);
            s.onended = function () {
                s = null;
            };
            s.play();
        }, aBeep ? 1000 : 10);
    };

    self.sayWords = function (aWords) {
        // say multiple words
        if (aWords.length === 0) {
            return;
        }
        var word, fn, s;
        word = aWords[0];
        aWords.splice(0, 1);
        fn = word.toString().toLowerCase().replace(/[ ,\.!]/g, '_');
        s = self.create('espeak/' + fn);
        s.onended = function () {
            // remove first word and say the rest of the words
            self.sayWords(aWords);
        };
        s.play();
    };

    self.sayMeters = function (aMeters, aUnit) {
        aMeters = Math.round(aMeters);
        if (aMeters >= 1000000) {
            return;
        }
        var unit, hundred, ten, a = [], thousand;
        // m or km?
        unit = aUnit || 'meters';
        if (aMeters >= 1000000) {
            thousand = Math.floor(aMeters / 1000000);
            aMeters -= thousand * 1000000;
            self.sayWords([thousand, 'thousand', 'kilometers']);
            return;
        }
        if (aMeters >= 1000) {
            aMeters = Math.floor(aMeters / 1000);
            unit = 'kilometers';
        }
        if (aMeters >= 100) {
            hundred = Math.floor(aMeters / 100);
            aMeters -= hundred * 100;
        }
        if (aMeters >= 20) {
            ten = Math.floor(aMeters / 10);
            aMeters -= ten * 10;
        }
        if (hundred) {
            a.push(100 * hundred);
        }
        if (ten) {
            a.push(10 * ten);
        }
        if (aMeters) {
            a.push(aMeters);
        }
        a.push(unit);
        self.sayWords(a);
    };

    return self;
}());


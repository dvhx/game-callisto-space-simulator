// Mission 2 - find lost radio beacon near c1
"use strict";
// globals: document, window, Vector, setInterval

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E2 = (function () {
    // source begin
    var self = SC.commonMission(),
        player;

    self.filename = 'easy_pirate_radio.js';
    self.category = 'Easy missions';
    self.title = 'Pirate radio';
    self.summary = 'Pirate radio station started broadcasting from some jovian moon, can you help us locate it?';
    self.description = 'Recently illegal radio station started broadcasting from one of the Jupiter\'s moon. We don\'t know which one is it and we also don\'t know exact frequency, but it is always between 470 and 490MHz. Find it and fill it in the report, then sign it.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleportNear('C1', 10, 15);

        // available sources
        self.moons = ['Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis'];

        // pick radio moon
        self.moon = SC.shuffleArray(self.moons)[0];
        self.moon_obj = SC.gos.findByName(self.moon);

        // pick radio freq
        self.frequency = (470 + Math.floor(20 * Math.random())) + 'MHz';
        self.find(self.moon).frequency = self.frequency;
        self.find(self.moon).frequencySecret = true;
        self.customRadioSource = {
            freq: self.frequency,
            clipboardFreq: '470-490MHz',
            clipboardSource: 'Pirate radio station',
            obj: self.moon_obj
        };
        console.log('moon', self.moon, 'frequency', self.frequency);

        // guide
        self.guide(self.summary, ['Continue', 'Abort']);
        self.guide('It transmit somewhere between 470 and 490MHz, find it and then locate what moon it comes from.', ['Continue']);
        self.guide('Find pirate radio, fill report!');

        // speed optimization
        SC.panel.horizon.updateInterval = 0.5;
        SC.panel.compass.updateInterval = 0.3;

        // create clipboard content
        self.createClipboard(function (aClipboard) {
            var v = [
                    '470MHz', '471MHz', '472MHz', '473MHz', '474MHz', '475MHz', '476MHz', '477MHz', '478MHz', '479MHz',
                    '480MHz', '481MHz', '482MHz', '483MHz', '484MHz', '485MHz', '486MHz', '487MHz', '488MHz', '489MHz', '490MHz'
                ],
                sig,
                radios_freq,
                radios_moon;
            aClipboard.h1('Report');
            aClipboard.p('Please find the pirate radio station frequency and source. Remember to sign the finished report!');
            radios_freq = aClipboard.radios('freq', v);
            radios_moon = aClipboard.radios('moon', self.moons);
            aClipboard.table([{
                Parameter: "Frequency",
                Value: radios_freq.div
            }, {
                Parameter: "Moon",
                Value: radios_moon.div
            }]);

            sig = aClipboard.signature(function () {
                // signature callback returns false if report is incomplete
                if (radios_freq.value === undefined) {
                    aClipboard.blink(radios_freq.div);
                    aClipboard.blink(sig.label, 'Fill form first!');
                    return false;
                }
                if (radios_moon.value === undefined) {
                    aClipboard.blink(radios_moon.div);
                    aClipboard.blink(sig.label, 'Fill form first!');
                    return false;
                }
                // check values
                if (radios_freq.value !== self.frequency) {
                    aClipboard.hide();
                    self.missionFailed('Frequency was incorrect!');
                    return true;
                }
                if (radios_moon.value !== self.moon) {
                    aClipboard.hide();
                    self.missionFailed('Moon was incorrect!');
                    return true;
                }
                aClipboard.hide();
                self.missionComplete();
                return true;
            });
        });

        // Cheats
        self.cheat(function () {
            player.face(self.moon_obj);
        });
        self.cheat(function () {
            SC.panel.radio.freq.updateValue(parseInt(self.frequency, 10) + 1);
            SC.panel.lidar.extraLabel('f+1');
        });
    };

    return self;
    // source end
}());

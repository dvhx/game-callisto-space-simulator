// Ship inspection, find broken instruments
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E8 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        ship;

    self.filename = 'easy_ship_inspection.js';
    self.category = 'Easy missions';
    self.title = 'Ship inspection';
    self.summary = 'I bought new ship and I need someone to board it and inspect all instruments. Then report what\'s broken or missing.';
    self.description = 'My new ship is parked near C1. Board it, test all instruments and fill the report of missing or broken equipment. Make sure you test the equipment thoroughly, some malfunctions are minor and hard to notice in a hurry. Fill the report and sign it.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleportNear('C1', 10, 15);

        // ship
        ship = self.place('Ship', 'C1', 0, 0);
        ship.teleportNear('C1', 20, 30);
        ship.model = 'fighter';
        ship.face('C1');
        ship.boardable = true;
        ship.fuel = 500;
        ship.fuelConsumption = 0.3;
        ship.fuelMax = 500;
        ship.thrust = Vector.create([0, 0, 0]);
        ship.thrustMax = 1200;
        ship.rot = Vector.create([0.01, 0.02, 0.03]);

        // avionics
        self.possibleGauges = ["compass", "horizon", "ctr", "abr", "ref", "linsim", "thrusters", "fb", "fuel", "clock", "lidar", "roll", "rotation", "radio", "battery", "sld", "cpy", "zoom_in", "zoom_out", "s10", "orto"];
        ship.gauges = SC.shuffleArray(self.possibleGauges.slice());
        self.broken = [
            ship.gauges[0],
            ship.gauges[1],
            ship.gauges[2]
        ];
        ship.broken = self.broken;
        self.missing = [];
        self.missing.push(ship.gauges.pop());
        self.missing.push(ship.gauges.pop());
        self.missing.push(ship.gauges.pop());

        // some cannot be missing
        ship.gauges.push("clipboard");
        ship.gauges.push("display");
        ship.gauges.push("thrust");
        ship.gauges.push("pan");
        ship.gauges.push("d3d");
        ship.gauges.push("ldra");

        ship.frequency = '503MHz';
        //self.customRadioSource = {freq: '503MHz', obj: ship, clipboardFreq: '503MHz', clipboardSource: 'New ship'};

        // guide
        self.guide('My new ship is parked near C1, board it and fill report of missing or broken instruments.', ['Continue', 'Abort']);
        self.guide('Board the ship and fill the report.', 'Continue');

        // create clipboard content
        self.createClipboard(function (aClipboard) {
            var v = ["missing", "broken", "OK"],
                j,
                sig,
                t,
                radios,
                r,
                gg = self.possibleGauges.sort();
            aClipboard.h1('Report');
            aClipboard.p('Inspect the ship and fill in following report of damaged or missing equipment. Remember to sign the finished report!');
            t = [];
            radios = {};
            for (j = 0; j < gg.length; j++) {
                r = aClipboard.radios('radio_' + gg[j], v);
                radios[gg[j]] = r;
                t.push({
                    Obj: gg[j],
                    Status: r.div
                });
            }
            aClipboard.table(t);

            function realGaugeState(aGauge) {
                if (self.broken.indexOf(aGauge) >= 0) {
                    return 'broken';
                }
                if (self.missing.indexOf(aGauge) >= 0) {
                    return 'missing';
                }
                return 'OK';
            }

            sig = aClipboard.signature(function () {
                // signature callback returns false if report is incomplete
                console.log(radios);
                // check for incomplete form
                var k;
                for (k in radios) {
                    if (radios.hasOwnProperty(k)) {
                        // check for incomplete
                        if (radios[k].value === undefined) {
                            aClipboard.blink(radios[k].div);
                            aClipboard.blink(sig.label, 'Fill form first!');
                            return false;
                        }
                        // incorrectly marked
                        if (radios[k].value !== realGaugeState(k)) {
                            aClipboard.hide();
                            self.missionFailed('You reported ' + k + ' as ' + radios[k].value + ' but it was ' + realGaugeState(k));

                            return true;
                        }
                    }
                }
                // all ok
                aClipboard.hide();
                self.missionComplete();
                return true;
            }, t);
            self.sig = sig;
        });

        // Cheats
        self.cheatTarget(ship, 1);
    };

    return self;
    // source end
}());

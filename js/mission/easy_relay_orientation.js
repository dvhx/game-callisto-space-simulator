// Mission 2 - find lost radio beacon near c1
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E3 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        ganymede;

    self.filename = 'easy_relay_orientation.js';
    self.category = 'Easy missions';
    self.title = 'Relay satellites';
    self.summary = 'One of the three relay satellites is out of alignment, find it and correct it.';
    self.description = 'There is a constellation of three relay satellites broadcasting at 507MHz. They are near C1 refueling station. One of them is not correctly oriented (two are pointing in same direction and one is pointing elsewhere). Reach the constellation, find which satellite is misaligned, board it and rotate it to correct direction.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleportNear('C1', 10, 15);

        // our target
        ganymede = self.find('Ganymede');

        // r1
        SC.r1 = self.place('R1', 'C1', 0, 0);
        SC.r1.teleportNear('C1', 300, 500);
        SC.r1.face('Ganymede');
        SC.r1.model = 'relay';
        SC.r1.boardable = true;
        self.customRadioSource = {
            freq: '507MHz',
            obj: SC.r1,
            clipboardFreq: '507MHz',
            clipboardSource: 'Relay satellites'
        };

        // r2
        SC.r2 = self.place('R2', 'C1', 0, 0);
        SC.r2.pos = SC.r1.pos.add(SC.r1.right.multiply(-5)).add(SC.r1.up().multiply(-8));
        SC.r2.speed = SC.r1.speed.dup();
        SC.r2.model = 'relay';
        SC.r2.face('Ganymede');
        SC.r2.rollDegrees(120);
        SC.r2.boardable = true;

        // r3
        SC.r3 = self.place('R3', 'C1', 0, 0);
        SC.r3.pos = SC.r1.pos.add(SC.r1.right.multiply(5)).add(SC.r1.up().multiply(-8));
        SC.r3.model = 'relay';
        SC.r3.speed = SC.r1.speed.dup();
        SC.r3.face('Ganymede');
        SC.r3.rollDegrees(60);
        SC.r3.boardable = true;

        // randomly one out of alignment
        switch (Math.floor(Math.random() * 3)) {
        case 0:
            SC.bad = SC.r1;
            break;
        case 1:
            SC.bad = SC.r2;
            break;
        case 2:
            SC.bad = SC.r3;
            break;
        }
        SC.bad.yawDegrees(5 + 5 * (Math.random() - Math.random()));
        SC.bad.pitchDegrees(5 + 5 * (Math.random() - Math.random()));

        // avionics
        SC.r1.gauges = ["clock", "lidar", "pan", "roll", "rotation", "display", "clipboard", "radio", "battery", "ldra", "sld", "cpy", "perf", "d3d", "zoom_in", "zoom_out", "rel", "con", "s10", "orto"];
        SC.r2.gauges = ["clock", "lidar", "pan", "roll", "rotation", "display", "clipboard", "radio", "battery", "ldra", "sld", "cpy", "perf", "d3d", "zoom_in", "zoom_out", "rel", "con", "s10", "orto"];
        SC.r3.gauges = ["clock", "lidar", "pan", "roll", "rotation", "display", "clipboard", "radio", "battery", "ldra", "sld", "cpy", "perf", "d3d", "zoom_in", "zoom_out", "rel", "con", "s10", "orto"];

        // guide
        self.guide('There is a constellation of three relay satellites (507MHz) near C1 refueling station, one of them is not correctly oriented.', ['Continue', 'Abort']);
        self.guide('Reach the constellation, find which satellite is misaligned and fix it.', ['Continue']);
        self.guide('First reach the satellites and await further instructions.', null, function () {
            self.checker = function () {
                if (player.distanceTo(SC.r1) <= 30) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });
        self.guide('They should all face in one direction but one of them is misaligned.', ['Continue']);
        self.guide('Find it and go within 3m of it. Then press BOARD button.', null, function () {
            self.checker = function () {
                if (SC.ship === SC.bad) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });
        self.guide('Hey, you found it. Now align it dead center on Ganymede. You can use lidar and CPY or do it manually. Make sure you completely stop any rotation.', null, function () {
            self.checker = function () {
                if (SC.radToDeg(SC.bad.dir.angleFrom(ganymede.pos.subtract(SC.bad.pos))) <= 1 && SC.bad.rot.modulus() <= 0.05) {
                    self.checker = null;
                    SC.ship.face(ganymede);
                    SC.ship.stop();
                    self.missionComplete();
                }
            };
        });

        // Cheats
        self.cheat(function () {
            player.face(SC.r1);
        });
        self.cheat(function () {
            player.teleport(SC.r1);
        });
        self.cheat(function () {
            player.teleport(SC.r2);
        });
        self.cheat(function () {
            player.teleport(SC.r3);
        });
    };

    return self;
    // source end
}());

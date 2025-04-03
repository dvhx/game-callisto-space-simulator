// Land on pad on Metis' equator
"use strict";
// globals: document, window, Vector, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.M4 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        metis,
        pad,
        landed = false;

    self.filename = 'medium_metis_equator_landing.js';
    self.category = 'Medium missions';
    self.title = 'Metis equator landing';
    self.summary = 'Gently land on Metis equator, within 3m of landing pad and dV < 1m';
    self.description = 'Metis is 20km wide innermost Jovian moon. You are on a circular equitorial orbit. There is a landing pad on Metis\' equator. Low gravity should not be a problem and you should be able to land within 3m of the spot with dV less than 1m/s';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');
        metis = self.find('Metis');
        metis.color = 'gray';

        // Pad
        pad = self.place("Pad", "Metis", 20, 0);
        pad.radius = 1.5;
        pad.model = 'gate';

        // Keep pad on Metis' surface
        SC.gos.afterUpdate = function () {
            pad.pos = metis.pos.add(metis.dir.multiply(metis.radius));
            pad.speed = metis.speed.dup();
            pad.face(metis);
            if (landed) {
                player.speed = pad.speed.dup();
            }
        };

        // Put it in lidar from the start
        SC.target = pad;

        // Player
        player = self.place("Player", "Metis", 40, 0);
        player.face('Metis');

        // Make time speed adjustable
        self.clockEditable(true);

        // Guide
        self.guideChecker('', function () {
            if (player.distanceTo(metis) < metis.radius) {
                var distance = player.distanceTo(pad),
                    dv;
                if (distance > 3) {
                    landed = true;
                    self.missionFailed("You landed " + distance.toFixed(1) + "m away");
                    return true;
                }
                dv = player.speed.subtract(pad.speed).modulus();
                if (dv > 1) {
                    landed = true;
                    self.missionFailed("You crashed too fast (" + dv.toFixed(1) + "m/s)");
                    return true;
                }
                landed = true;
                self.missionComplete("You landed " + distance.toFixed(1) + "m away at " + dv.toFixed(1) + "m/s");
                return true;
            }
        });
        self.guide('Land within 3m of the pad slower than 1m/s.', ['Continue', 'Abort', 'Edit']);
    };

    return self;
    // source end
}());

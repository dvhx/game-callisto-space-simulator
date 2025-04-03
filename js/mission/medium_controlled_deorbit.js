// Mission 2 - find lost radio beacon near c1
"use strict";
// globals: document, window, Vector, setInterval, setTimeout, clearInterval

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.M1 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        c1,
        callisto;

    self.filename = 'medium_controlled_deorbit.js';
    self.category = 'Medium missions';
    self.title = 'Controlled deorbit';
    self.summary = 'Help remotely deorbit old satellite by crashing it on the surface of callisto';
    self.description = "We need to crash old satellite to Callisto's surface. It is very important to crash it to specific location, the tolerance is only 10km, otherwise you can destroy other ground equipment. Optimal descent trajectory will be highlighted by virtual gates. Fly through them, they will show you if you are too fast or too slow. You have one solid rocket booster (press SRB to fire it, it lasts 25 seconds), that will help you quickly loose a lot of speed. This is long mission so you can use clock instrument to temporarily accelerate time, but fly through last gate at normal speed for maximum accuracy.";

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        callisto = self.find('Callisto');
        c1 = self.find('C1');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.pos = c1.pos.add(Vector.i.multiply(25)).add(Vector.j.multiply(8)).add(Vector.k.multiply(5));
        player.speed = c1.speed.dup();

        // gates
        self.gates = {};
        self.gatesDistance = {};

        // Gates custom update (keep them in sync with callisto, no gravity)
        setInterval(function () {
            var k;
            for (k in self.gates) {
                if (self.gates.hasOwnProperty(k)) {
                    self.gates[k].customUpdate(self.gates[k]);
                }
            }
        }, 300);

        // add gates
        var i, d = 6000000,
            p = 220.1 + 3;
        for (i = 1; i < 80; i++) {
            self.addGate(d, p, 'Gate ' + i);
            d -= 22.3 * i * i;
            p += 0.100;
        }

        // periodically measure distance to all gates
        self.interval = setInterval(function () {

            // target nearest gate
            var k, s, dd = 6000000000,
                sd;
            for (k in self.gates) {
                if (self.gates.hasOwnProperty(k)) {

                    // measure distance
                    s = self.gates[k].pos.subtract(player.pos);
                    sd = s.modulus();
                    if (sd < self.gatesDistance[k]) {
                        self.gatesDistance[k] = sd;
                    }

                    // target nearest gate if out of range
                    if (SC.panel.lidar.outOfRange && (player.dir.angleFrom(s) < 0.78)) {
                        if (sd < dd) {
                            dd = sd;
                            SC.target = self.gates[k];
                        }
                    }
                }
            }

            // test for crash on callisto
            if (player.distanceTo(callisto) <= callisto.radius) {
                dd = player.distanceTo(self.gates["Gate 79"]);
                if (dd < 10000) {
                    self.missionComplete('Satellite crashed within 10km distance from last gate (' + (dd / 1000).toFixed(1) + 'km)');
                } else {
                    self.missionFailed('Satellite crashed more than 10km from last gate (' + (dd / 1000).toFixed(1) + 'km)');
                }
                clearInterval(self.interval);
            }
        }, 1000);

        // better initial 2D zoom
        SC.render2d.centered = player;
        SC.render2d.zoom = 0.000035;
        //SC.panel.display_mode = '2D';

        // face first gate, callisto bottom down
        player.face(self.gates['Gate 1']);
        SC.target = self.gates['Gate 1'];
        player.rollDegrees(90);

        // vertical orto
        SC.panel.buttons.orto.button.click();
        SC.panel.buttons.orto.button.click();

        // only one 73kN SRB
        SC.srb.backDefault = false;
        SC.srb.add();

        // guide
        self.guide(self.summary, ['Continue', 'Abort']);
        self.guide('Fly to the first gate. Then use SRB to slowdown.', 'Continue');

        // it's old so we disable few
        SC.panel.hideGauge('horizon');
        SC.panel.hideGauge('compass');
        SC.panel.hideGauge('radio', true);
        SC.panel.hideGauge('battery', true);
        //SC.panel.hideGauge('thrusters');
        SC.panel.hideGauge('linsim', true);
        //SC.panel.hideGauge('fuel');
        SC.panel.hideGauge('sld');
        SC.panel.hideGauge('abr');
        SC.panel.hideGauge('ref');
        SC.panel.hideGauge('board');
        SC.panel.hideGauge('photo');

        // for performance
        SC.gosRemove('Mercury,Venus,Earth,Moon,Mars,Io,Europa,Ganymede,Adrastea,Himalia,Metis,Amalthea,Saturn,Uranus,Neptune,Pluto,C2,C3,I1,E1,G1');

        SC.panel.clock.editable = true;
        SC.panel.clock.render();

        // Cheats
        self.cheat(function () {
            player.teleport(self.gates["Gate 79"], 150000);
            player.speed = player.speed.add(player.dir.multiply(8000));
        });
    };

    self.lastGate = player;

    self.addGate = function (aDistance, aPhaseDeg, aName) {
        // Create one gate
        var x = aDistance * Math.sin(SC.degToRad(aPhaseDeg)),
            y = aDistance * Math.cos(SC.degToRad(aPhaseDeg)),
            p = callisto.pos.add(callisto.dir.multiply(x)).add(callisto.right.multiply(y)),
            o;
        o = self.place(aName, 'Callisto', 220, 0);
        o.pos = p;
        o.radius = 1000;
        o.color = 'white';
        o.model = 'gate';
        o.labelMaxDistance = 20000;
        o.maxRenderDistance = 400000;
        o.maxModelRenderDistance = 100000;
        o.face(self.lastGate || player);
        self.lastGate = o;
        o.customUpdate = function () {
            o.speed = callisto.speed.dup();
            o.pos = callisto.pos.add(callisto.dir.multiply(x)).add(callisto.right.multiply(y));
        };
        self.gates[aName] = o;
        self.gatesDistance[aName] = 1e9;
        return o;
    };

    return self;
    // source end
}());

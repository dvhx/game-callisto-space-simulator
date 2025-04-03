// Mission - check incoming ships for weird antennas
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E6 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        ship;

    self.filename = 'easy_check_incoming_ships.js';
    self.category = 'Easy missions';
    self.title = 'Check incoming ships';
    self.summary = 'Pilots recently started mounting range extenders on their antennas. They are interferring with hangar electronics. Check them out and don\'t let them dock.';
    self.description = 'In this mission you stay nearby C1 station and check every incoming ship, there is convoy of 10 ships coming. You have to check every single one of them for any weird antennas. If they have antenna extender you have to deny their entry to the station, otherwise you let them in. Don\'t take too long for decision or they\'ll get angry.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        SC.c1 = self.find('C1');

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleport('C1');
        player.pos = SC.randomPos(SC.c1.pos, 10, 15);
        player.face(SC.c1);
        player.yawDegrees(15 * (Math.random() - Math.random()));
        player.pitchDegrees(15 * (Math.random() - Math.random()));
        player.rollDegrees(15 * (Math.random() - Math.random()));

        // Guide
        self.guide('Pilots recently started mounting range extenders on their antennas. They are interferring with hangar electronics. Check them out and don\'t let them dock.', ['Continue', 'Abort']);
        self.guide('If you see ship with weird looking antennas asking for dock deny them, but let normal ships dock.', ['Continue']);
        self.guide('Don\'t let them wait too long. The ships will be here any minute. Wait for it to stop completely.', null, function () {
            setTimeout(function () {
                self.guideClear('');
                self.createNextShip();
            }, 5000);
        });

        // Cheats
        self.cheat(function () {
            self.clockEditable(true);
        });
    };

    self.addAntenna = function (aModel, aSize) {
        // Add antenna (3 short lines) to random vertex of a model
        var i, a, b, c, v, v1, v2;

        // pick random vertex
        i = Math.floor(aModel.vertices.length * Math.random());
        v = Vector.create(aModel.vertices[i].elements);

        // orto vectors to v
        v1 = v.cross(Vector.i).toUnitVector();
        v2 = v.cross(Vector.j).toUnitVector();
        if (v1.modulus() === 0) {
            v1 = v.cross(Vector.k).toUnitVector();
        }
        if (v2.modulus() === 0) {
            v2 = v.cross(Vector.k).toUnitVector();
        }

        // add three more away from center
        a = v.add(v.toUnitVector().multiply(aSize)).add(v1.multiply(aSize / 2));
        b = v.add(v.toUnitVector().multiply(aSize)).add(v2.multiply(aSize / 2));
        c = v.add(v.toUnitVector().multiply(aSize));

        // add vertices
        a = aModel.vertices.push(a) - 1;
        b = aModel.vertices.push(b) - 1;
        c = aModel.vertices.push(c) - 1;

        // make 3 lines
        aModel.lines.push([i, a]);
        aModel.lines.push([i, b]);
        aModel.lines.push([i, c]);
        return aModel;
    };

    self.remaining = 10;

    self.saidMeters = {};

    function sayMetersOnce(aMeters) {
        // Show how far the ship is
        var m = Math.floor(aMeters / 10) * 10;
        if (!self.saidMeters.hasOwnProperty(m)) {
            self.saidMeters[m] = true;
            //SC.sound.sayMeters(m);
            SC.panel.display.dialog(m + 'm');
        }
    }

    function shipApproachC1(aShip) {
        // let ship slowly approach c1
        aShip.face(SC.c1);
        var d = aShip.distanceTo(SC.c1);
        sayMetersOnce(ship.distanceTo(SC.c1));
        if (d < 50) {
            aShip.speed = SC.c1.speed.add(aShip.dir.multiply(0.7));
        }
        if (d < 15) {
            aShip.speed = SC.c1.speed.add(aShip.dir.multiply(0.7));
        }
        if (d < 10) {
            aShip.speed = SC.c1.speed.add(aShip.dir.multiply(0.4));
        }
        if (d < 8) {
            aShip.speed = SC.c1.speed.dup();
            // remove this program, start waiting
            aShip.customUpdate = null;
            self.decided = '';
            SC.sound.say('Ship arrived!');
            SC.panel.display.dialog('Ship has arrived, decide within next 30s!', ['Approve', 'Deny'], function (aButton) {
                self.decided = aButton;
                if (aButton === 'Approve' && ship.model === 'custom') {
                    // user approved but ship had antenna
                    player.teleport(ship, 10);
                    player.face(ship);
                    self.missionFailed('This ship had illegal antenna and you let it in!');
                    return;
                }
                if (aButton === 'Deny' && ship.model !== 'custom') {
                    // user denied but ship was ok
                    player.teleport(ship, 10);
                    player.face(ship);
                    self.missionFailed('This ship was perfectly fine but you denied it!');
                    return;
                }
                if (aButton === 'Approve') {
                    // after approve move aship towards station
                    ship.speed = SC.c1.speed.add(ship.dir.multiply(0.5));
                }
                if (aButton === 'Deny') {
                    // after deny move ship away from station
                    ship.speed = SC.c1.speed.add(ship.dir.multiply(-1));
                }
                self.guideShow('Good decision. Wait for the next ship...');
                self.remaining--;
                if (self.remaining <= 0) {
                    self.missionComplete();
                } else {
                    setTimeout(self.createNextShip, 5000);
                }
            });
            setTimeout(function () {
                if (!self.decided) {
                    self.missionFailed('Your inspection took too long!');
                }
            }, 30000);
        }
    }

    // run program for approaching ship
    setInterval(function () {
        if (ship && ship.customUpdate) {
            ship.customUpdate(ship);
        }
    }, 300);

    self.createNextShip = function () {
        // create custom model with antennas on random places (or not)
        console.log('createNextShip');
        // remove old ship
        if (ship) {
            SC.gos.items.splice(SC.gos.items.indexOf(ship), 1);
        }
        // random model
        var model = SC.shuffleArray(['delta', 'fighter', 'beacon', 'cube', 'station', 'octagon'])[0],
            size = SC.model.dimensions(SC.modelData[model]).size;
        // copy model
        SC.modelData.custom = JSON.parse(JSON.stringify(SC.modelData[model]));
        // add antenna to custom model
        self.addAntenna(SC.modelData.custom, 0.1 * size);
        // place ship randomly around c1
        ship = self.place('Ship', 'C1', 0.050, 360 * Math.random());
        ship.model = Math.random() < 0.5 ? 'custom' : model;
        ship.face(SC.c1);
        ship.speed = SC.c1.speed.add(ship.dir.multiply(1));
        ship.radius = 3 / size;
        ship.customUpdate = shipApproachC1;
        self.guideShow('New ship approaching...');
        self.saidMeters = {};
    };

    return self;
    // source end
}());

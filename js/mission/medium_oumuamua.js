// Land on pad on Metis' pole
"use strict";
// globals: document, window, Vector, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.M6 = (function () {
    // source begin
    var self = SC.commonMission(),
        sun,
        o,
        gate,
        player;

    self.filename = 'medium_oumuamua.js';
    self.category = 'Medium missions';
    self.title = "'Oumuamua";
    self.summary = "Photograph first interstellar comet 'Oumuamua as it intersects ecliptic near Earth at 0.1AU at 50km/s.";
    self.description = "First interstellar comet 'Oumuamua was discovered on 2017-10-19 when it was already leaving solar system. It flew by Earth only at 0.1 AU with speed of almost 50km/s, too fast to be landed on. You were sent on the trajectory that almost precisely intersect it's path, however small corrections may be necessary. Your mission is to photograph it from distance 10-50km. For optimal image capture it must be less than 10° from the screen center. If you get really close you will be able to see it's unusual shape. Use PHOTO button to capture the photo. Place where it will intersect ecliptic and thus your rendezvous point is marked by virtual cube with the size of 50km, 'Oumuamua will cross this cube in about one second! The exact time of the crossing is 53:55 mission time, you can watch virtual cube ETA on lidar to precisely time your arrival.";

    function modelFromJson(aJson) {
        // Create model from string '{"vertices": [[1,2,3], [10,20,30], [0,0,0]], "lines": [[0,1], [1,2]]}'
        var j = JSON.parse(aJson),
            ret = {
                vertices: [],
                lines: j.lines
            },
            i;
        for (i = 0; i < j.vertices.length; i++) {
            ret.vertices.push(Vector.create(j.vertices[i]));
        }
        return ret;
    }

    self.event = function (aEvent) {
        if (aEvent === 'photo') {
            var s = o.pos.subtract(player.pos),
                angle = SC.radToDeg(player.dir.angleFrom(s)),
                dist = s.modulus();
            //console.log(aEvent, 'angle', angle, 'dist', dist);
            // must be somewhat in the center of screen
            if (angle > 10) {
                SC.mission.guideShow('Target ' + angle.toFixed(2) + 'deg off center!');
                SC.sound.say('Target off center!');
                return;
            }
            // must be close enough
            if (dist > 50000) {
                SC.mission.guideShow('Target too far (' + SC.humanDistance(dist) + ')');
                SC.sound.say('Target too far!');
                return;
            }
            // not to close
            if (dist < 10000) {
                SC.mission.guideShow('Target too close (' + SC.humanDistance(dist) + ')');
                SC.sound.say('Target too close!');
                return;
            }
            SC.time.speed = 0.0001;
            self.missionComplete('Perfect photo from distance ' + SC.humanDistance(dist) + ', ' + angle.toFixed(1) + 'deg off center!', dist);
        }
    };

    self.init = function () {
        // Init solar system at 2017-10-10T12:00:00
        sun = self.place('Sun');
        self.place('Mercury', "Sun", SC.solarSystem.data.Mercury.distance / 1000, 240);
        self.place('Venus', "Sun", SC.solarSystem.data.Venus.distance / 1000, 163);
        self.place('Earth', "Sun", SC.solarSystem.data.Earth.distance / 1000, 30);
        self.place('Mars', "Sun", SC.solarSystem.data.Mars.distance / 1000, 163);
        self.place('Jupiter', "Sun", SC.solarSystem.data.Jupiter.distance / 1000, 213);
        self.place('Saturn', "Sun", SC.solarSystem.data.Saturn.distance / 1000, 267);
        self.place('Uranus', "Sun", SC.solarSystem.data.Uranus.distance / 1000, 27);
        self.place('Neptune', "Sun", SC.solarSystem.data.Neptune.distance / 1000, 343);

        // meeting point
        gate = self.place("X", "Sun", 1.31 * SC.solarSystem.data.Earth.distance / 1000, 24.96935);
        gate.model = 'cube';
        gate.rot = Vector.create([0, 0, 0]);
        gate.radius = 25000;
        window.gate = gate;
        SC.target = gate;

        // custom model
        SC.modelData.oumuamua = modelFromJson('{"vertices": [[2.702, 0.021, 0.09],[2.646, 0, -0.09],[1.683, 0, 0.381],[1.613, 0, -0.301],[-0.862, 0, 0.43],[-0.356, 0, -0.477],[-1.094, 0, 0.486],[-1.094, 0, -0.294],[-1.138, 0, 0.35],[-2.53, 0, -0.012],[1.64, -0.361, 0.066],[1.659, 0.464, 0.066],[0.619, -0.483, 0.066],[0.609, 0.512, 0.066],[-0.609, -0.445, 0.066],[-0.712, 0.445, 0.066],[-2.184, -0.108, 0.066],[-2.221, 0.061, 0.026],[-2.521, -0.23, 0.066],[-2.54, 0.136, 0.066],[-2.943, -0.886, -0.086],[-2.962, 0.727, -0.086],[1.099, -0.359, 0.066],[0.424, -0.969, -0.088],[-0.345, -1.306, -0.584],[0.443, -0.584, -0.088],[1.099, 0.391, 0.066],[0.424, 1, -0.088],[-0.345, 1.337, -0.584],[0.443, 0.616, -0.088],[0.614, 0.001, 0.506]], "lines": [[16, 18],[17, 19],[18, 20],[20, 21],[19, 21],[22, 23],[24, 25],[23, 24],[12, 25],[26, 27],[27, 28],[28, 29],[13, 29],[0, 2],[0, 1],[1, 11],[1, 3],[1, 10],[4, 6],[6, 8],[11, 13],[3, 5],[13, 15],[14, 16],[8, 16],[8, 17],[15, 17],[5, 7],[7, 17],[12, 14],[10, 12],[4, 30],[2, 30]]}');

        // object
        o = self.place("'Oumuamua", "Sun", 1.309 * SC.solarSystem.data.Earth.distance / 1000, 25);
        o.radius = 1000;
        o.pos.elements[2] = 55000000 - 27000;
        o.model = 'oumuamua';
        o.rot = Vector.create([0, 0, 0]);

        // correct direction
        o.face('Uranus');
        o.yawDegrees(10);
        o.pitchDegrees(20);
        o.rollDegrees(160);

        // correct speed
        o.speed = sun.speed.add(o.dir.multiply(49670));

        // Player
        player = self.place('Player', "Sun", 1.31 * SC.solarSystem.data.Earth.distance / 1000, 24.9680);
        player.face("X");
        player.speed = gate.speed.add(player.dir.multiply(1000));

        // Make time speed adjustable
        self.clockEditable(true);

        // Optimal initial zoom
        SC.render2d.zoom = 0.00000736;

        // Hide horizon
        SC.panel.horizon.hide(true);

        // Guide
        self.guide("Photograph 'Oumuamua when it fly through virtual cube at 53:55", ['Continue', 'Abort', 'Edit']);
    };

    return self;
    // source end
}());

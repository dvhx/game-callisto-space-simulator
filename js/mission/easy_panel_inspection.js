// Mission 2 - find lost radio beacon near c1
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E4 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        c1,
        r1,
        r2,
        r3;

    self.filename = 'easy_panel_inspection.js';
    self.category = 'Easy missions';
    self.title = 'Panel inspection';
    self.summary = 'Some of the satellites are reporting low voltage. Check solar panels for any possible damage. Submit report.';
    self.description = 'There is a constellation of 3 relay satellites broadcasting at 507MHz near C1 refueling station. Some of them reported lower solar panel output. Reach the constellation, find if there is any damage, count the cracks on all solar panels for each satellite and fill in the report in the mission clipboard. Don\'t forget to sign the report.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        c1 = self.find('C1');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleport('C1');
        player.pos = SC.randomPos(c1.pos, 10, 15);
        player.face(c1);
        player.yawDegrees(15 * (Math.random() - Math.random()));
        player.pitchDegrees(15 * (Math.random() - Math.random()));
        player.rollDegrees(15 * (Math.random() - Math.random()));

        // random count of cracks
        self.cracks = {
            relay1left: 1 + Math.round(7 * Math.random()),
            relay1right: Math.round(7 * Math.random()),
            relay2left: Math.round(7 * Math.random()),
            relay2right: Math.round(7 * Math.random()),
            relay3left: Math.round(7 * Math.random()),
            relay3right: 1 + Math.round(7 * Math.random())
        };

        // create cracked panels models
        SC.modelData.crackedRelay1 = self.crackPanel(SC.modelData.relay, self.cracks.relay1left, self.cracks.relay1right);
        SC.modelData.crackedRelay2 = self.crackPanel(SC.modelData.relay, self.cracks.relay2left, self.cracks.relay2right);
        SC.modelData.crackedRelay3 = self.crackPanel(SC.modelData.relay, self.cracks.relay3left, self.cracks.relay3right);

        // r1
        r1 = self.place('R1', 'C1', 0, 0);
        r1.teleportNear('C1', 300, 500);
        r1.face('Ganymede');
        r1.model = 'crackedRelay1';
        self.customRadioSource = {
            freq: '507MHz',
            obj: r1,
            clipboardFreq: '507MHz',
            clipboardSource: 'Relay satellites'
        };

        // r2
        r2 = self.place('R2', 'C1', 0, 0);
        r2.pos = r1.pos.add(r1.right.multiply(-5)).add(r1.up().multiply(-8));
        r2.speed = r1.speed.dup();
        r2.model = 'crackedRelay2';
        r2.face('Ganymede');
        r2.rollDegrees(120);

        // r3
        r3 = self.place('R3', 'C1', 0, 0);
        r3.pos = r1.pos.add(r1.right.multiply(5)).add(r1.up().multiply(-8));
        r3.model = 'crackedRelay3';
        r3.speed = r1.speed.dup();
        r3.face('Ganymede');
        r3.rollDegrees(60);

        // randomly one out of alignment
        switch (Math.floor(Math.random() * 3)) {
        case 0:
            SC.bad = r1;
            break;
        case 1:
            SC.bad = r2;
            break;
        case 2:
            SC.bad = r3;
            break;
        }
        SC.bad.yawDegrees(5 + 5 * (Math.random() - Math.random()));
        SC.bad.pitchDegrees(5 + 5 * (Math.random() - Math.random()));

        // avionics
        r1.gauges = ["clock", "lidar", "pan", "roll", "rotation", "display", "clipboard", "radio", "battery", "ldra", "sld", "cpy", "perf", "d3d", "zoom_in", "zoom_out", "rel", "con", "s10", "orto"];
        r2.gauges = ["clock", "lidar", "pan", "roll", "rotation", "display", "clipboard", "radio", "battery", "ldra", "sld", "cpy", "perf", "d3d", "zoom_in", "zoom_out", "rel", "con", "s10", "orto"];
        r3.gauges = ["clock", "lidar", "pan", "roll", "rotation", "display", "clipboard", "radio", "battery", "ldra", "sld", "cpy", "perf", "d3d", "zoom_in", "zoom_out", "rel", "con", "s10", "orto"];

        // Guide
        self.guide('There is a constellation of three relay satellites (507MHz) near C1 refueling station, Some of them reported lower solar panel output.', ['Continue', 'Abort']);
        self.guide('Reach the constellation, find if there are any damage on solar panels.', ['Continue']);
        self.guide('Count the cracks on solar panels for each satellite and fill in report in your mission clipboard below.', ['Continue']);
        self.guide('Count cracks, fill report.');

        // create clipboard content
        self.clipboard = self.createClipboard(function (aClipboard) {
            var v = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                r1r,
                r2r,
                r3r,
                sig;
            aClipboard.h1('Report');
            aClipboard.p('Inspect all three relay satellites and fill in following report. Remember to sign the finished report!');
            r1r = aClipboard.radios('r1r', v);
            r2r = aClipboard.radios('r2r', v);
            r3r = aClipboard.radios('r3r', v);
            aClipboard.table([{
                Obj: "R1",
                Cracks: r1r.div
            }, {
                Obj: "R2",
                Cracks: r2r.div
            }, {
                Obj: "R3",
                Cracks: r3r.div
            }]);

            sig = aClipboard.signature(function () {
                // signature callback returns false if report is incomplete
                if (r1r.value === undefined) {
                    aClipboard.blink(r1r.div);
                    aClipboard.blink(sig.label, 'Fill form first!');
                    return false;
                }
                if (r2r.value === undefined) {
                    aClipboard.blink(r2r.div);
                    aClipboard.blink(sig.label, 'Fill form first!');
                    return false;
                }
                if (r3r.value === undefined) {
                    aClipboard.blink(r3r.div);
                    aClipboard.blink(sig.label, 'Fill form first!');
                    return false;
                }
                // check values
                if (r1r.value !== self.cracks.relay1left + self.cracks.relay1right) {
                    aClipboard.hide();
                    self.missionFailed();
                    return true;
                }
                if (r2r.value !== self.cracks.relay2left + self.cracks.relay2right) {
                    aClipboard.hide();
                    self.missionFailed();
                    return true;
                }
                if (r3r.value !== self.cracks.relay3left + self.cracks.relay3right) {
                    aClipboard.hide();
                    self.missionFailed();
                    return true;
                }
                aClipboard.hide();
                self.missionComplete();
                return true;
            }, null);
        });

        // Cheats
        self.cheat(function () {
            self.clockEditable(true);
            player.face(r1);
        });
        self.cheat(function () {
            player.teleport(r1, 8);
        });
        self.cheat(function () {
            player.teleport(r2, 8);
        });
        self.cheat(function () {
            player.teleport(r3, 8);
        });
    };

    self.crackPanel = function (aModel, aLeftCount, aRightCount) {
        // Add cracks to ship model
        var i, y, a, b, m = JSON.parse(JSON.stringify(aModel));
        // left panel
        for (i = 0; i < aLeftCount; i++) {
            y = 1.3 + ((5.7 - 1.3) / aLeftCount) * (i + 0.5 + 0.5 * (Math.random() - Math.random()));
            a = m.vertices.push(Vector.create([0, y, 0.7]));
            b = m.vertices.push(Vector.create([0, y + 0.1 * (Math.random() - Math.random()), 0.7 - 0.1 - 0.1 * Math.random()]));
            m.lines.push([a - 1, b - 1]);
        }
        // right panel
        for (i = 0; i < aRightCount; i++) {
            y = -1.3 - ((5.7 - 1.3) / aRightCount) * (i + 0.5 + 0.5 * (Math.random() - Math.random()));
            a = m.vertices.push(Vector.create([0, y, 0.7]));
            b = m.vertices.push(Vector.create([0, y + 0.1 * (Math.random() - Math.random()), 0.7 - 0.1 - 0.1 * Math.random()]));
            m.lines.push([a - 1, b - 1]);
        }
        return m;
    };

    return self;
    // source end
}());

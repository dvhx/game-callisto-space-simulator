// Mission 1 - reach C1 station on callisto orbit
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.H6 = (function () {
    // source begin
    var self = SC.commonMission(),
        earth,
        player,
        st = 'ISS',
        beacon;

    self.filename = 'hard_refuel_iss.js';
    self.category = 'Transfer missions';
    self.title = 'Earth ISS refuel';
    self.summary = 'Catch up with ISS. Distance 1\'927\'901km, deltaV 19km/s.';
    self.description = 'Transfer missions are always the same. They are also very hard. They are also very hard. You start somewhere and your goal is to get to your destination. In the beginning of the mission you can choose how many boosters you use. They have 73kN thrust but they are heavy (500kg + 1380kg fuel). They last for 25s but you can stop them sooner than that. Booster fires in the same direction of recently used forward/back thruster. If you want to accelerate shortly tap thrust forward then press SRB button. After use SRB is discarded with unspent fuel as well.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter',
            'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Place stations
        earth = self.find('Earth');
        var altitude = earth.radius / 1000 + 405;
        self.place('ISS', 'Earth', altitude, 15);

        //self.customRadioSource = {freq: '531MHz', obj: iss};
        // beacon (so that player can compare movement from original place)
        beacon = self.place('Beacon', 'Earth', altitude, 0.001);
        beacon.model = 'beacon';

        // Player
        player = self.place("Player", "Earth", altitude, 0);
        player.face(st);
        SC.target = self.find(st);

        // Crashing on earth will end mission
        self.crashChecker(['Earth'], 5);

        // Make time speed adjustable
        self.clockEditable(true);

        // refueling will end the mission
        self.event = self.eventRefuel(st);

        // Guide
        self.guide(self.summary, ['Continue', 'Abort']);
        self.guide(SC.srb.dialog);

        // remove photo button
        SC.panel.buttons.photo.button.style.display = 'none';

        // add wire button
        earth.renderAlways = true;
        SC.panel.buttons.wire = SC.button('display_right', 'WIRE', 'green', false, function (aOn) {
            earth.model = aOn ? 'sphere' : '';
        }, true);

        // Cheats
        self.cheatTarget(st);
    };

    return self;
    // source end
}());

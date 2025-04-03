// Training linsim
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T8 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        c1;

    self.filename = 'training_linsim.js';
    self.category = 'Training missions';
    self.title = 'Linsim';
    self.summary = 'How to use linear simulator to estimate distances and time.';
    self.description = 'In this training mission you will learn how to use linear simulator to estimate how much thrust you need to accelerate or brake, or how long you need to accelerate to achieve desired speed.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        c1 = self.find('C1');
        SC.target = c1;

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);

        // Guide
        self.guide('In this training mission you will learn how to use linear simulator to estimate how much thrust you need to accelerate and break.', ['Continue', 'Abort'], function () {
            player.face(c1);
            player.stop();
            c1.pos = player.pos
                .add(player.dir.multiply(5000))
                .add(player.right.multiply(0))
                .add(player.up().multiply(0));
            c1.speed = player.speed.dup();
        });

        self.guide('You not gonna need all these instruments so I\'ll remove them.', 'Continue', function () {
            player.face(c1);
            player.stop();
            c1.pos = player.pos
                .add(player.dir.multiply(5000))
                .add(player.right.multiply(0))
                .add(player.up().multiply(0));
            c1.speed = player.speed.dup();
            SC.panel.hideGauge('thrust');
            //SC.panel.hideGauge('thrusters');
            //SC.panel.hideGauge('fb', true);
            //.SC.panel.hideGauge('fuel');
            //SC.panel.hideGauge('lidar');
            SC.panel.hideGauge('battery', true);
            SC.panel.hideGauge('radio', true);
            //SC.panel.hideGauge('linsim', true);
            SC.panel.hideGauge('pan');
            SC.panel.hideGauge('rotation');
            SC.panel.hideGauge('roll', true);
            //SC.panel.hideGauge('clock');
            SC.panel.hideGauge('ldra');
            SC.panel.hideGauge('sld');
            SC.panel.hideGauge('cpy');
            SC.panel.hideGauge('ctr');
            SC.panel.hideGauge('abr');
            SC.panel.hideGauge('compass');
            SC.panel.hideGauge('horizon');
            SC.panel.hideGauge('s10');
            SC.panel.hideGauge('orto');
            SC.panel.hideGauge('ref');
            //SC.panel.hideGauge('perf');
            SC.panel.hideGauge('d3d');
            SC.panel.hideGauge('zoom_in');
            SC.panel.hideGauge('zoom_out');
            //SC.panel.hideGauge('rel');
            //SC.panel.hideGauge('con');
            SC.panel.hideGauge('board');
            SC.panel.hideGauge('photo');
            SC.panel.hideGauge('srb');
        });

        self.guide('Let\'s say you want speed 20m/s. How long do you need to press forward thrust? It\'s very simple with linsim.', 'Continue');

        self.guide('Use T knob in linsim. Increase the T value until V reaches 20m/s.', null, function () {
            self.checker = function () {
                if (SC.panel.linsim.v.state.value >= 19.5 && SC.panel.linsim.v.state.value <= 21) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide(function () {
            self.guideShow('You can use clock to measure time. Put the forward thrust up and count ' + SC.panel.linsim.t.state.value.toFixed(0) + 's. Try it!', 'Continue');
        });

        self.guide(function () {
            self.guideShow('Now you know that in order to reach ' + SC.panel.linsim.v.state.value.toFixed(0) + 'm/s you need to move forward at full speed for ' + SC.panel.linsim.t.state.value.toFixed(0) + 's.', 'Continue');
        });

        self.guide(function () {
            self.guideShow('The distance you will travel while accelerating to ' + SC.panel.linsim.v.state.value.toFixed(0) + 'm/s will be ' + SC.panel.linsim.s.state.value.toFixed(0) + 'm', 'Continue');
        });

        self.guide(function () {
            self.guideShow('Breaking is similar to accelerating. If you are approaching target at ' + SC.panel.linsim.v.state.value.toFixed(0) + 'm/s. You need ' + SC.panel.linsim.s.state.value.toFixed(0) + 'm for breaking.', 'Continue');
        });

        self.guide('So you simply watch the lidar and when distance get to that value you start breaking.', 'Continue');

        self.guide('The "m" is weight of ship in kg, without fuel.', 'Continue');

        self.guide('The "mf" is weight of the remaining fuel, it is updated automatically.', 'Continue');

        self.guide('The "F" is force of thrusters. Maximum is 1200N. That is when you pull lever completely up/down.', 'Continue');

        self.guide('The "s" is traveled distance in meters.', 'Continue');

        self.guide('The "fc" is fuel consumption in grams per second. Thrusters on one side of the ship consumes 300g/s.', 'Continue');

        self.guide('The "V0" is initial speed, for example when you want to accelerate from 17m/s to 23m/s you set V0 to 17 and increase T until V is 23.', 'Continue');

        self.guide('The "T" is time. How long should you accelerate or decelerate.', 'Continue');

        self.guide('The "V" is final speed after acceleration or deceleration.', 'Continue');

        self.guide(function () {
            self.missionComplete('That\'s it. Now you can use linsim.');
        });
    };

    return self;
    // source end
}());

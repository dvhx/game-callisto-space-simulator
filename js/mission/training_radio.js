// Training rotation
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T6 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        c1;

    self.filename = 'training_radio.js';
    self.category = 'Training missions';
    self.title = 'Radio receiver';
    self.summary = 'How to use radio receiver to find targets.';
    self.description = 'In this mission you will learn how to use radio receiver to find targets. You will learn how to switch bands, change frequency and angle of antenna. Your task will be to locate source using narrow angle antenna.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        c1 = self.find('C1');
        SC.target = c1;
        SC.c1 = c1;

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.face('Jupiter');

        // Radio updater?

        // Guide
        self.guide('In this training mission you will learn how to operate radio receiver to find targets.', ['Continue', 'Abort'], function () {
            player.face(c1);
            player.stop();
            player.pos = player.pos.add(player.right.multiply(2000));
            player.speed = c1.speed.dup();
        });

        self.guide('You not gonna need all these instruments so I\'ll remove them. You only need some instruments.', 'Continue', function () {
            SC.panel.hideGauge('thrust');
            SC.panel.hideGauge('thrusters');
            SC.panel.hideGauge('fb', true);
            SC.panel.hideGauge('fuel');
            //SC.panel.hideGauge('lidar');
            SC.panel.hideGauge('battery', true);
            //SC.panel.hideGauge('radio', true);
            SC.panel.hideGauge('linsim', true);
            SC.panel.hideGauge('compass');
            SC.panel.hideGauge('horizon');
            SC.panel.hideGauge('clock');
            SC.panel.hideGauge('ldra');
            SC.panel.hideGauge('sld');
            SC.panel.hideGauge('cpy');
            SC.panel.hideGauge('ctr');
            SC.panel.hideGauge('abr');
            SC.panel.hideGauge('ref');
            SC.panel.hideGauge('pan');
            SC.panel.hideGauge('roll', true);
            SC.panel.hideGauge('rotation');
            //SC.panel.hideGauge('perf');
            SC.panel.hideGauge('d3d');
            SC.panel.hideGauge('zoom_in');
            SC.panel.hideGauge('zoom_out');
            SC.panel.hideGauge('s10');
            SC.panel.hideGauge('orto');
            //SC.panel.hideGauge('rel');
            //SC.panel.hideGauge('con');
            SC.panel.hideGauge('board');
            SC.panel.hideGauge('photo');
            SC.panel.hideGauge('srb');
        });

        self.guide('10km in front of you is space station C1. Turn on the radio by moving BAND knob right. Set band to MHz.', null, function () {
            player.face(c1);
            player.stop();
            player.pos = player.pos.add(player.right.multiply(2000));
            player.speed = c1.speed.dup();
            self.checker = function () {
                if (SC.panel.radio.band.state.valueLabel === 'MHz') {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Set frequency knob to 513 MHz and listen. You should hear the signal.', null, function () {
            self.checker = function () {
                if (SC.panel.radio.band.state.valueLabel === 'MHz' && SC.panel.radio.freq.state.value === 513) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Right now the antenna is receiving from any direction (360°). I want you to slowly lower the angle until you loose the signal completely.', null, function () {
            self.checker = function () {
                if (SC.panel.radio.band.state.valueLabel === 'MHz' && SC.panel.radio.freq.state.value === 513 && SC.panel.radio.receivingVolume <= 0.05) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Great. The moment you lost the signal is the angle where the source is. It can be left, right, up or down that angle.', 'Continue');

        self.guide('Now stay on 513MHz and set angle to 5°, then rotate the ship until the signal is strongest.', null, function () {
            SC.panel.unhideGauge('pan');
            SC.panel.unhideGauge('rotation');
            SC.panel.unhideGauge('orto');
            SC.panel.unhideGauge('s10');
            self.checker = function () {
                if (SC.panel.radio.receivingStation === '513MHz' && SC.panel.radio.angle.state.value <= 5 && SC.panel.radio.receivingVolume >= 0.5) {
                    self.checker = null;
                    self.missionComplete('You found it, the station is in front of you. You can now use radio to locate radio sources.');
                }
            };
        });
    };

    return self;
    // source end
}());

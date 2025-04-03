// Refuel player's ship in nearby refueling station
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.ref = (function () {
    var self = {};
    self.soundRefuel = SC.sound.create('refuel');
    self.soundContact = SC.sound.create('contact');

    self.onClick = function (aOn, aButton) {
        // Handle button click
        console.log('ref', aOn, aButton);

        function error(aMessage) {
            // say error and shortly flash button red
            aButton.color('red');
            if (Array.isArray(aMessage)) {
                SC.sound.sayWords(aMessage);
            } else {
                SC.sound.say(aMessage, true);
            }
            setTimeout(function () {
                aButton.light(false);
                aButton.color('green');
            }, 1000);
        }

        function stint() {
            // one refuel stint
            console.log('stint');
            // target still must be < 3m (may drift away)
            if (SC.target.pos.subtract(SC.player.pos).modulus() > 3) {
                self.refueling = false;
                error('Fuel station out of range!');
                return;
            }
            self.soundRefuel.onended = function () {
                // increase fuel
                SC.player.fuel += 50;
                if (SC.player.fuel > SC.player.fuelMax) {
                    self.refueling = false;
                    SC.player.fuel = SC.player.fuelMax;
                    error('Fuel tank full!');
                    SC.mission.event('refuel', SC.target);
                    return;
                }
                // continue
                stint();
            };
            aButton.color('yellow');
            self.soundRefuel.play();
        }

        if (aOn) {
            console.log('Will refuel');
            // no target
            if (!SC.target) {
                error('No target!');
                self.soundRefuel.pause();
                return;
            }
            // target must be refuel
            if (!SC.target.refuel) {
                error('Target is not a fuel station!');
                return;
            }
            // tank must not be full
            if (SC.player.fuel >= SC.player.fuelMax) {
                error('Fuel tank full!');
                return;
            }
            // target must be < 3m
            if (SC.target.pos.subtract(SC.player.pos).modulus() > 3) {
                error('Fuel station out of range!');
                return;
            }
            // already refueling?
            if (self.refueling) {
                return;
            }
            console.log('Start refueling');
            self.refueling = true;
            // contact
            self.soundContact.onended = stint;
            self.soundContact.play();
        }
    };

    return self;
}());


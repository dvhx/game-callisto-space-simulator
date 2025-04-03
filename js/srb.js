// Solid rocket booster (73kN, 25s, 1380kg fuel, 500kg weight)
"use strict";
// globals: window, document, Vector, setTimeout

var SC = window.SC || {};

SC.srb = (function () {
    var self = {}, sound, dropIndex = 0, old_clock_editable, id = 0;
    self.items = [];
    self.totalMass = 0;
    self.current = undefined;
    self.back = undefined;
    self.backDefault = undefined;
    self.source = undefined;

    sound = document.createElement('audio');
    sound.src = 'sound/srb.ogg';
    sound.loop = true;

    self.add = function (aThrust, aDuration, aFuel, aMass) {
        // Add one SRB to items
        id++;
        aFuel = aFuel || 1380;
        aMass = aMass || 500;
        self.totalMass += aFuel + aMass;
        SC.player.mass += aFuel + aMass;
        SC.panel.linsim.m.updateValue(SC.player.mass);
        return self.items.push({
            id: id,
            thrust: aThrust || 73000,
            duration: aDuration || 25,
            fuel: aFuel,
            mass: aMass
        });
    };

    self.dialog = function () {
        // Ask player how many SRB he wants
        var thrust = 73000, duration = 25, fuel = 1380, mass = 100;
        // what type
        SC.panel.display.dialog('What type of boosters you want', ['73kN/1380kg', '914kN/27t'], function (aType) {
            if (aType === '914kN/27t') {
                thrust = 914000;
                duration = 170;
                fuel = 27000;
                mass = 470;
            }
            // how many
            SC.panel.display.dialog('How many SRB (' + thrust + 'N, ' + duration + 's, ' + fuel + 'kg fuel, ' + mass + 'kg engine) you want?', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], function (aButton) {
                var i;
                for (i = 0; i < aButton; i++) {
                    self.add(thrust, duration, fuel, mass);
                }
            });
        });
    };

    self.start = function () {
        // start one SRB
        if (self.items.length <= 0) {
            SC.sound.say('No more boosters!');
            SC.panel.buttons.srb.color('red');
            return false;
        }
        if (self.backDefault !== undefined) {
            self.back = self.backDefault;
        }
        if (self.back === undefined) {
            SC.sound.say('Choose direction using forward and back lever!');
            return false;
        }
        // disable time speedup
        SC.time.speed = 1;
        old_clock_editable = SC.panel.clock.editable;
        SC.panel.clock.editable = false;
        SC.panel.clock.render();

        SC.panel.buttons.srb.color(self.back ? 'green' : 'blue');
        SC.sound.say('Solid rocket booster ignited!');
        self.current = self.items.pop();
        sound.play();
        // update player's thrust
        self.current.old_thrust_max = SC.player.thrustMax;
        self.current.old_fuel_consumption = SC.player.fuelConsumption;
        self.current.old_fuel = SC.player.fuel;
        self.current.old_fuel_max = SC.player.fuelMax;
        self.current.old_fuel_update_interval = SC.panel.fuel.updateInterval;
        SC.panel.fuel.updateInterval = 0.3;
        SC.player.thrustMax = self.current.thrust;
        SC.player.fuel = self.current.fuel;
        SC.player.fuelMax = SC.player.fuel;
        SC.player.mass -= self.current.fuel;
        SC.player.fuelConsumption = self.current.fuel / self.current.duration;
        SC.panel.linsim.m.updateValue(SC.player.mass);
        SC.panel.linsim.mf.updateValue(SC.player.fuel);
        //console.log(SC.player);
        // disable FB and thrust
        self.current.old_fb_enabled = SC.panel.fb.enabled;
        self.current.old_thrust_enabled = SC.panel.thrust.enabled;
        SC.panel.fb.enabled = false;
        SC.panel.thrust.enabled = false;
        // stop after 30s at most
        var srb_to_stop_by_timer = self.current.id;
        setTimeout(function () {
            if (self.current && self.current.id === srb_to_stop_by_timer) {
                console.log('srb stop by timer', srb_to_stop_by_timer);
                self.stop();
            } else {
                console.log('srb timer ignored for ', srb_to_stop_by_timer, 'current is', self.current && self.current.id);
            }
        }, self.current.duration * 1000);
        return self.current;
    };

    self.update = function () {
        // update color of SRB button, set SRB thrust, called by main panel
        if (SC.panel.fb.state.value > 0 && (self.back !== false)) {
            SC.panel.buttons.srb.color('blue');
            self.back = false;
        }
        if (SC.panel.fb.state.value < 0 && (self.back !== true)) {
            SC.panel.buttons.srb.color('green');
            self.back = true;
        }
        if (!self.current) {
            return false;
        }
        SC.player.thrustMax = SC.srb.current.thrust;
        SC.player.thrust = SC.player.dir.multiply((self.back ? 1 : -1) * SC.srb.current.thrust);
        SC.player.fuelConsumption = self.current.fuel / self.current.duration;
        return true;
    };

    self.stop = function () {
        // stop current SRB and drop it
        if (!self.current) {
            return;
        }
        SC.panel.clock.editable = old_clock_editable;
        SC.panel.clock.render();
        // stop
        sound.pause();
        sound.currentTime = 0;
        // reenable panel
        SC.panel.fb.enabled = self.current.old_fb_enabled;
        SC.panel.thrust.enabled = self.current.old_thrust_enabled;
        // restore player
        //console.log('restored', SC.player.fuel);
        SC.player.thrustMax = 0;
        SC.player.mass -= self.current.mass;
        SC.panel.linsim.m.updateValue(SC.player.mass);
        // drop
        SC.panel.buttons.srb.light(false);
        SC.sound.say('Solid rocket booster detached!');
        //dropSrb(SC.player);
        setTimeout(function () {
            dropIndex++;
            SC.fasttext.prepare('SRB' + dropIndex, 'pink', 8);
            var o = new SC.go('SRB' + dropIndex, Vector.i, Vector.i, Vector.j, Vector.i, 0.5, 750, 'red');
            o.pos = SC.player.pos.add(SC.player.dir.multiply(5));
            o.dir = SC.player.dir.dup();
            o.right = SC.player.right.dup();
            o.speed = SC.player.speed.add(SC.player.dir.multiply(2)).add(SC.player.right.multiply(0.6));
            o.face(SC.player);
            o.model = 'octagon';
            o.pitchDegrees(90);
            o.rot = Vector.create([0, 0.2, 0.1]);
            SC.gos.items.push(o);
            SC.gos.updateFgm(true);
        }, 500);
        // restore player
        SC.player.thrust = Vector.create([0, 0, 0]);
        SC.player.thrustMax = self.current.old_thrust_max;
        SC.player.fuelConsumption = self.current.old_fuel_consumption;
        SC.player.fuel = self.current.old_fuel;
        SC.player.fuelMax = self.current.old_fuel_max;
        SC.panel.fuel.updateInterval = self.current.old_fuel_update_interval;
        SC.panel.fuel.update(SC.panel.fuel.state, true);
        // forget
        self.oldCurrent = self.current;
        self.current = undefined;
    };

    self.onClick = function (aOn, aButton) {
        // Handle SRB button click
        console.log(aOn);
        if (self.current) {
            self.stop();
        } else {
            if (self.start()) {
                aButton.light(true);
            }
        }
    };

    return self;
}());


// Game time and related functions
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.time = (function () {
    var self = {}, currentMs, oldMs = Date.now();
    self.s = 0;
    self.speed = 1;
    self.speedLimit = 99;
    self.dt = 0;
    self.tainted = false;

    self.faster = function () {
        // Make time goes faster
        if (self.speed < 10) {
            self.speed++;
        } else {
            self.speed += 10;
        }
        if (self.speed > self.speedLimit) {
            self.speed = self.speedLimit;
        }
        return self.speed;
    };

    self.slower = function () {
        // Make time goes slower
        if (self.speed <= 10) {
            self.speed--;
        } else if (self.speed < 20) {
            self.speed = 10;
        } else {
            if (self.speed === 99) {
                self.speed = 90;
            } else {
                self.speed -= 10;
            }
        }
        if (self.speed < 1) {
            self.speed = 1;
        }
        return self.speed;
    };

    self.update = function () {
        // update internal time
        currentMs = Date.now();
        var ms = currentMs - oldMs;
        // aiming for 20FPS but allows up to 3x lower FPS
        if (ms > 3000 / 20) {
            ms = 3000 / 20;
        }
        // increase simulation speed
        self.dt = self.speed * ms / 1000;
        // but if too fast mark it as tainted (moons may fly out)
        if (self.dt > 1) {
            self.tainted = true;
        }
        // increase seconds
        self.s += self.dt;
        // remember old time
        oldMs = currentMs;
        // return DT
        return self.dt;
    };

    self.hhmmss = function (aSeconds) {
        // return time in HH:MM:SS format
        var t = Math.abs(Math.floor(aSeconds || self.s)), sec, min, hrs;
        sec = t % 60;
        t -= sec;
        min = Math.floor(t / 60) % 60;
        t -= min * 60;
        hrs = t / 3600;
        return (hrs <= 99 ? ('0' + hrs).substr(-2) : hrs) + ':' + ('0' + min).substr(-2) + ':' + ('0' + sec).substr(-2);
    };

    self.hms = function (aSeconds) {
        // shortest version of time in HH:MM:SS format (e.g. 3:25 instead of 00:03:25)
        var t = Math.abs(Math.floor(aSeconds || self.s)), sec, min, hrs, a = [];
        sec = t % 60;
        t -= sec;
        min = Math.floor(t / 60) % 60;
        t -= min * 60;
        hrs = t / 3600;
        if (hrs > 0) {
            a.push(hrs);
        }
        if (min >= 0) {
            a.push(min);
        }
        a.push(('0' + sec).substr(-2));
        return a.join(':');
    };

    self.save = function () {
        // Return data for persistence
        return {
            s: self.s,
            speed: self.speed,
            tainted: self.tainted
        };
    };

    self.load = function (aData) {
        // Restore from persistent storage
        self.s = aData.s;
        self.speed = aData.speed;
        self.tainted = aData.tainted;
        currentMs = Date.now();
        oldMs = Date.now();
    };

    return self;
}());


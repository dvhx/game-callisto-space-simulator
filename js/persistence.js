// Saving and loading games
"use strict";
// globals: document, window, localStorage

var SC = window.SC || {};

SC.persistence = (function () {
    var self = {};

    self.save = function () {
        var o = {
            items: SC.gos.items,
            time: SC.time.save()
        };
        localStorage.setItem('CA_MISSION_' + SC.missionKey, JSON.stringify(o));
    };

    self.load = function (aMission) {
        var i, o = JSON.parse(localStorage.getItem('CA_MISSION_' + aMission)), a = [];
        // init mission

        // restore GO items
        for (i = 0; i < o.items.length; i++) {
            a[i] = new SC.go(o.items[i].name); //SC.gos.items[i].name)
            a[i].copyFrom(o.items[i]);
        }
        SC.gos.items = a;
        SC.player = SC.gos.findByName('Player');
        SC.c1 = SC.gos.findByName('C1');
        SC.target = SC.c1;

        // restore time
        SC.time.load(o.time);
        for (i = 0; i < SC.gauges.length; i++) {
            SC.gauges[i].updateTime = 0;
        }

        // FGM update
        SC.gos.updateFgm(true);
        SC.gos.update();
        SC.panel.update(SC.player);

        return a;
    };

    return self;
}());

// Initialize fly with specific mission
"use strict";
// globals: window, document, setTimeout, requestAnimationFrame

var SC = window.SC || {};

// initialize window
SC.flyInit = function (aParams) {
    try {
        SC.params = aParams || JSON.parse(SC.shared.get() || '{}');
        SC.missionKey = SC.params.mission || 'E1';
        SC.missionMode = SC.params.mode || 'accept';
        SC.mission = SC.missions[SC.missionKey];
        if (SC.missionMode === 'custom') {
            SC.mission = SC.compileCustomMission(SC.missionKey);
        }
        console.log('mission', SC.missionKey, SC.mission.title);

        // start new mission
        if (SC.missionMode === 'accept' || SC.missionMode === 'custom') {
            SC.mission.init();
            // First gos update
            SC.gos.updateFgm(true);
            SC.gos.update();
            // guide
            if (SC.mission.intro) {
                SC.panel.guideNext();
            }
        }
        // prepare all radio sources
        SC.mission.radioSources = SC.gos.radioSources();

        // main rendering
        var oneFrame = function () {
            SC.perf.begin('frame');
            // update gos
            SC.gos.update();
            // update panel
            SC.panel.update(SC.player);
            SC.perf.end('frame');
            // next frame
            setTimeout(function () {
                requestAnimationFrame(oneFrame);
            }, 50);
        };
        oneFrame();

        // back button
        SC.back.push(SC.abortDialog);

        // keyboard init
        if (SC.keyboardInit) {
            console.log('Calling SC.keyboardInit');
            SC.keyboardInit();
        }
    } catch (e) {
        console.error(e.stack);
        document.getElementById('loading').textContent = e;
    }

    /*
    // this is for internal testing (prevents test from exit)
    setTimeout(function () {
        document.getElementById('loading').style.color = 'green';
        document.getElementById('loading').style.zIndex = '333';
        document.getElementById('loading').style.display = 'flex';
    }, 500);
    setTimeout(function () {
        document.getElementById('loading').style.color = 'blue';
    }, 1000);
    setTimeout(function () {
        document.getElementById('loading').style.color = 'orange';
    }, 1500);
    setTimeout(function () {
        document.getElementById('loading').style.color = 'red';
    }, 2000);
    setTimeout(function () {
        document.getElementById('loading').style.color = 'yellow';
    }, 2500);
    setTimeout(function () {
        document.getElementById('loading').style.color = 'lime';
    }, 3000);
    setTimeout(function () {
        document.getElementById('loading').style.color = 'fuchsia';
    }, 3500);
    setTimeout(function () {
        document.getElementById('loading').style.display = 'none';
    }, 5000);
    */
};


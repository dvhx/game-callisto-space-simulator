// Play sound in loop without clicking noise when volume is changed
"use strict";
// globals: document, window, AudioContext, XMLHttpRequest, setTimeout

var SC = window.SC || {};

SC.audioLoop = function (aAudioFileUrl, aInitialVolume, aMinVolume) {
    var self = {},
        context = new AudioContext(),
        gain = context.createGain(),
        source,
        request,
        //playing = false,
        started = false;

    // defaults
    aInitialVolume = aInitialVolume || 1;
    aMinVolume = aMinVolume || 0;

    // load the audio
    if (document.location.protocol !== 'file:') {
        request = new XMLHttpRequest();
        request.open('GET', aAudioFileUrl, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            context.decodeAudioData(request.response, function (aBuffer) {
                source = context.createBufferSource();
                source.buffer = aBuffer;
                source.loop = true;
                gain.connect(context.destination);
                source.connect(gain);
                gain.gain.setTargetAtTime(aInitialVolume, context.currentTime, 0.015);
            }, function (error) {
                console.error(error);
            });
        };
        request.send();
    }

    self.setVolume = function (aVolume) {
        // Change the volume without clicking noise
        if (!started && source) {
            source.start(0);
            started = true;
        }
        /*
        if (aVolume === 0 && playing) {
            setTimeout(function () {
                context.suspend();
                playing = false;
            }, 150);
        }
        if (aVolume > 0 && !playing) {
            context.resume();
            playing = true;
        } */
        var rv = aVolume === 0 ? 0 : aMinVolume + aVolume * (1 - aMinVolume);
        //console.log('v', aVolume, 'rv', rv, 'mv', aMinVolume);
        gain.gain.setTargetAtTime(rv, context.currentTime, 0.015);
    };

    return self;
};


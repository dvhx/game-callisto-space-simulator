// Digital linear newtonian simulator (take mass of ship and fuel, fuel consumption, force, time and show new speed and distance)
"use strict";
// globals: window, document, requestAnimationFrame

var SC = window.SC || {};

SC.gaugeLinsim = function (aParent) {
    // create linsim
    var self = SC.gauge(aParent, 'bg');
    self.updateInterval = 5;

    self.container.style.display = 'block';
    self.container.id = "linsim_container";
    self.container.className = "visible";

    // main calculation function
    self.update = function () {
        if (!self.enabled || self.hidden) {
            return;
        }
        if (self.broken) {
            return;
        }
        if (!self.v) {
            return;
        }
        var
            m = self.m.state.value,
            mf = self.mf.state.value,
            fc = self.fc.state.value / 1000,
            f = self.f.state.value,
            tmax = self.t.state.value,
            i, dv, ds, dt, t = 0, s = 0, v = self.v0.state.value;
        if (self.log) {
            console.log('m=' + m + ' mr=' + (m - fc * tmax) + ' fc=' + fc + ' f=' + f + ' t=' + t);
        }
        for (i = 0; i < tmax; i++) {
            dt = 1;
            if (mf - fc * i < 0) {
                self.t.updateValue(i);
                break;
            }
            dv = f / (m + mf - fc * i) * dt;
            ds = v * dt;
            v += dv;
            s += ds;
            t += dt;
            if (self.log) {
                console.log('v=' + v + ' m=' + (m - fc * i).toFixed(1) + ' s=' + s + ' t=' + t + ' dv=' + dv + ' ds=' + ds + ' dt=' + dt);
            }
        }
        self.s.updateValue(s);
        self.v.updateValue(v);
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render after screen rotate
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        self.m.resize();
        self.mf.resize();
        self.v0.resize();
        self.fc.resize();
        self.f.resize();
        self.t.resize();
        self.s.resize();
        self.v.resize();
        self.update();
    };

    self.enable = function (aValue) {
        // this is used in pwr button
        var o = aValue ? '1' : '0';
        self.m.fg.canvas.style.opacity = o;
        self.f.fg.canvas.style.opacity = o;
        self.mf.fg.canvas.style.opacity = o;
        self.v0.fg.canvas.style.opacity = o;
        self.fc.fg.canvas.style.opacity = o;
        self.t.fg.canvas.style.opacity = o;
        self.s.fg.canvas.style.opacity = o;
        self.v.fg.canvas.style.opacity = o;
        self.enabled = aValue;
    };

    function one(aId) {
        // create one div, set id and add it to container
        var d = document.createElement('div');
        d.id = aId;
        self.container.appendChild(d);
        return d;
    }

    // add knobs
    self.m = SC.gaugeLcdKnob(one('linsim_m'), 'm;kg', 5, 500, 1, 99999, self.update);
    self.mf = SC.gaugeLcdKnob(one('linsim_mf'), 'mf;kg', 5, 500, 0, 99999, self.update);
    self.f = SC.gaugeLcdKnob(one('linsim_f'), 'F;N', 5, 1200, -9999, 99999, self.update);
    self.s = SC.gaugeLcdKnob(one('linsim_s'), 's;m', 5, 1500, -9999, 99999);

    self.fc = SC.gaugeLcdKnob(one('linsim_fc'), 'fc;g/s', 5, 300, 1, 99999, self.update);
    self.v0 = SC.gaugeLcdKnob(one('linsim_v0'), 'V0;m/s', 5, 0, -9999, 99999, self.update);
    self.t = SC.gaugeLcdKnob(one('linsim_t'), 'T;s', 5, 0, 1, 99999, self.update);
    self.v = SC.gaugeLcdKnob(one('linsim_v'), 'V;m/s', 5, 0, -9999, 99999);

    self.add(self.m);
    self.add(self.mf);
    self.add(self.f);
    self.add(self.s);
    self.add(self.fc);
    self.add(self.v0);
    self.add(self.t);
    self.add(self.v);

    self.hideOrig = self.hide;
    self.hide = function (aHidden) {
        // hide roundly and also knob
        var d = aHidden ? 'none' : '';
        self.hideOrig(aHidden, true);
        self.m.container.style.display = d;
        self.mf.container.style.display = d;
        self.f.container.style.display = d;
        self.s.container.style.display = d;
        self.fc.container.style.display = d;
        self.v0.container.style.display = d;
        self.t.container.style.display = d;
        self.v.container.style.display = d;
        if (aHidden) {
            self.container.classList.remove('visible');
        } else {
            self.container.classList.add('visible');
        }
    };

    return self;
};


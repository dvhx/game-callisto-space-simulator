// Rectangular general-purpose display gauge
// linter: ngspicejs-lint
// global: document, window, setTimeout
"use strict";

var SC = window.SC || {};

SC.gaugeDisplay = function (aParent) {
    // create display
    var self = SC.gauge(aParent, "bg,display,fg");
    var margin = 3;
    self.handleDigits = true;
    self.updateInterval = 3;

    self.fg.canvas.style.pointerEvents = "none";

    self.update = function (aState) {
        // draw display content
        self.state = aState;
        self.updateTime = SC.time.s;
        self.updateCount++;
    };

    self.render = function () {
        // render everything
        // re-render itself hidden
        if (self.hidden) {
            self.renderHidden();
            return;
        }
        var i;
        var a;
        var b;
        var cc;
        self.display.canvas.style.padding = "0.5ex";
        self.display.canvas.style.boxSizing = "border-box";
        // background bevel
        self.bg.clear();
        self.bevel(self.bg.context, margin, margin, self.bg.w - margin, self.bg.h - margin, 0, false);
        self.bevel(self.bg.context, 0, 0, self.bg.w - 2, self.bg.h - 2, margin, false);
        // green lines
        self.fg.clear();
        for (i = 0; i < self.fg.h - 2 * margin; i += 1) {
            if (i % 2 === 0) {
                self.fg.line(margin, margin + i + 0.5, self.fg.w - margin, margin + i + 0.5, "green", 0.2);
            } else {
                self.fg.line(margin, margin + i + 0.5, self.fg.w - margin, margin + i + 0.5, "rgba(0,0,0,0.5)", 0.3);
            }
        }
        // cross
        cc = self.fg;
        a = 0.05 * cc.square.s;
        b = 0.1 * cc.square.s;
        cc.line(cc.square.cx - a, cc.square.cy, cc.square.cx - b, cc.square.cy, "yellow", 0.5);
        cc.line(cc.square.cx + a, cc.square.cy, cc.square.cx + b, cc.square.cy, "yellow", 0.5);
        cc.line(cc.square.cx, cc.square.cy - a, cc.square.cx, cc.square.cy - b, "yellow", 0.5);
        cc.line(cc.square.cx, cc.square.cy + a, cc.square.cx, cc.square.cy + b, "yellow", 0.5);
        // glare
        self.drawGlare(self.fg.context, self.fg.square, function () {
            self.fg.context.fillRect(margin, margin, self.fg.w - 2 * margin, self.fg.h - 2 * margin);
        });
        // update
        self.update(self.state, true);
        self.renderCount++;
    };

    self.dialog = function (aMessage, aButtons, aCallback) {
        // show dialog between lines and fg
        var dlg = document.createElement("div");
        var div = document.createElement("div");
        var msg = document.createElement("p");
        var msgs = document.createElement("div");
        var nav = document.createElement("nav");
        var i;
        var btn;
        var prev;
        // remove previous
        prev = self.container.getElementsByClassName("display_dlg");
        while (prev.length > 0) {
            prev[0].parentElement.removeChild(prev[0]);
        }
        dlg.className = "display_dlg";
        dlg.appendChild(msg);
        dlg.appendChild(nav);
        msg.className = "msg";
        msgs.className = "msgs";
        msgs.textContent = aMessage;
        msg.appendChild(msgs);
        msgs.onclick = function () {
            // Click on message will hide it
            if (msgs.textContent === "(show)") {
                msgs.textContent = aMessage;
            } else {
                msgs.textContent = "(show)";
            }
        };
        function onClick(event) {
            //console.warn('gauge_display.js onClick', event);
            event.preventDefault();
            event.stopPropagation = true;
            dlg.parentElement.removeChild(dlg);
            setTimeout(function () {
                aCallback(event.target.textContent);
            }, 200);
        }
        if (aButtons) {
            if (typeof aButtons === "string") {
                aButtons = aButtons.split(";");
            }
            for (i = 0; i < aButtons.length; i++) {
                btn = document.createElement("button");
                btn.textContent = aButtons[i];
                btn.onclick = onClick;
                nav.appendChild(btn);
            }
        }
        msg.style.opacity = 0;
        nav.style.opacity = 0;
        self.fg.canvas.insertAdjacentElement("beforeBegin", dlg);
        setTimeout(function () {
            msg.style.opacity = 1;
            nav.style.opacity = 1;
        }, 200);
        return { dlg: dlg, div: div, msg: msg};
    };

    self.displayDigitsHandler = function (aLcdKnob, aCallback) {
        // bind display digits handler to one LCD knob
        aLcdKnob.container.addEventListener("click", function () {
            self.displayDigits(aLcdKnob, aCallback);
        });
    };

    self.displayDigits = function (aLcdKnob, aCallback) {
        // Show digits and up/down arrows to more easily change LCD knobs on mobile
        if (!self.handleDigits) {
            return;
        }
        var old = self.container.getElementsByClassName("display_digits");
        while (old.length > 0) {
            old[0].parentElement.removeChild(old[0]);
        }
        var div = document.createElement("div");
        div.className = "display_digits";
        var digits = "00000000" + aLcdKnob.state.value;
        digits = digits.substr(-4).split("").map(function (f) { return parseInt(f, 10); });
        var spans = [];
        var life = 0;

        // update on the other side
        aLcdKnob.callback2 = function () {
            digits = "00000000" + aLcdKnob.state.value;
            digits = digits.substr(-4).split("").map(function (f) { parseInt(f, 10); });
            spans.forEach(function (a, i) { a.textContent = digits[i]; });
            life = 0;
        };

        function tic() {
            // autohide after some time
            life++;
            if (life > 3) {
                if (div.parentElement) {
                    div.parentElement.removeChild(div);
                    aLcdKnob.callback2 = null;
                }
            } else {
                setTimeout(tic, 1000);
            }
        }
        tic();

        function onButton(event) {
            // change value on up/down button
            life = 0;
            var index = event.target.dataIndex;
            var delta = event.target.dataDelta;
            digits[index] += delta;
            if (digits[index] >= 10) {
                digits[index] = 0;
            }
            if (digits[index] < 0) {
                digits[index] = 9;
            }
            aLcdKnob.updateValue(parseInt(digits.join(""), 10));
            aCallback(aLcdKnob);
            spans[index].textContent = digits[index];
        }

        function oneDigit(aParent, aIndex) {
            // Create one digit
            var dd = document.createElement("div");
            var up = document.createElement("button");
            var span = document.createElement("span");
            var down = document.createElement("button");

            dd.onclick = function () { self.clicktime = 0; };
            dd.className = "digit";

            up.textContent = "▲";
            up.dataDelta = 1;
            up.dataIndex = aIndex;
            up.dataSpan = span;
            up.addEventListener("click", onButton, true);
            dd.appendChild(up);

            span.textContent = digits[aIndex];
            spans.push(span);
            dd.appendChild(span);

            down.textContent = "▼";
            down.dataDelta = -1;
            down.dataIndex = aIndex;
            down.dataSpan = span;
            down.addEventListener("click", onButton, true);
            dd.appendChild(down);

            aParent.appendChild(dd);
            return {div: dd, up: up, span: span, down: down};
        }

        // 4 digits
        oneDigit(div, 0);
        oneDigit(div, 1);
        oneDigit(div, 2);
        oneDigit(div, 3);

        self.fg.canvas.insertAdjacentElement("beforeBegin", div);
    };

    self.render();

    return self;
};


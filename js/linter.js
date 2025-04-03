// Universal linter toolbar (js, css, html)
"use strict";
// globals: document, window, JSLINT, textareaSetCaretPos, CSSLint, html_beautify, js_beautify

var SC = SC || {};

SC.lintJs = function (aCode) {
    // lint JS
    var errors = [], y, pos, lines = aCode.split('\n'), options = {predef: ['console', 'SC', 'alert', 'prompt', 'confirm', 'JSLINT', 'Vector'], browser: true, continue: true}, i, e, r;
    r = JSLINT(aCode, options);
    if (!r) {
        for (i = 0; i < JSLINT.errors.length; i++) {
            e = JSLINT.errors[i];
            // null
            if (!e) {
                continue;
            }
            // allow ++ and -- everywhere
            if (e.reason === "Unexpected '++'.") {
                continue;
            }
            if (e.reason === "Unexpected '--'.") {
                continue;
            }
            // allow global use strict
            if (e.reason.match("Use the function form of \'use strict\'.")) {
                continue;
            }
            // find pos
            pos = 0;
            if (e.line && e.character) {
                for (y = 0; y < e.line - 1; y++) {
                    pos += lines[y].length + 1;
                }
                pos += e.character;
            }
            // add error to list
            errors.push({message: e.reason, line: e.line, character: e.character, detail: e, pos: pos});
        }
    }
    return errors;
};

SC.lintJsTextarea = function (aTextarea) {
    // Lint js in textarea
    var code = ('"use strict";\n' + aTextarea.value).split('\n'), e, q, s;
    // wrap code in anonymous function, indent
    if (code.slice(-1)[0] === 'return self;') {
        code.pop();
    }
    // lint
    e = SC.lintJs(code.join('\n'));
    // jump to first error
    if (e && (e.length > 0)) {
        console.error(e);
        aTextarea.focus();
        q = e[0].pos - 1 - 14;
        s = aTextarea.value;
        aTextarea.value = s.substring(0, q);
        aTextarea.scrollTop = aTextarea.scrollHeight;
        aTextarea.value = s;
        aTextarea.setSelectionRange(q, q + 1);
        SC.showToast(e[0].message);
    }
    return e;
};

SC.beautifyJs = function (aCode) {
    // Beautify js code
    return js_beautify(aCode, {jslint_happy: true});
};


﻿/*
jquery.animate-enhanced plugin v0.99
---
http://github.com/benbarnett/jQuery-Animate-Enhanced
http://benbarnett.net
@benpbarnett
*/
(function (c, I, J) {
    function O(a, b, c, f, l, k, h, p, q) {
        var t = !1, h = !0 === h && !0 === p, b = b || {}; b.original || (b.original = {}, t = !0); b.properties = b.properties || {}; b.secondary = b.secondary || {}; for (var p = b.meta, m = b.original, g = b.properties, P = b.secondary, B = r.length - 1; 0 <= B; B--) {
            var D = r[B] + "transition-property", E = r[B] + "transition-duration", i = r[B] + "transition-timing-function", c = h ? r[B] + "transform" : c; t && (m[D] = a.css(D) || "", m[E] = a.css(E) || "", m[i] = a.css(i) || ""); P[c] = h ? (!0 === q || !0 === y && !1 !== q) && K ? "translate3d(" + p.left + "px, " + p.top +
            "px, 0)" : "translate(" + p.left + "px," + p.top + "px)" : k; g[D] = (g[D] ? g[D] + "," : "") + c; g[E] = (g[E] ? g[E] + "," : "") + f + "ms"; g[i] = (g[i] ? g[i] + "," : "") + l
        } return b
    } function z(a) { for (var c in a) return !1; return !0 } function G(a) { return parseFloat(a.replace(a.match(/\D+$/), "")) } function L(a) { var c = !0; a.each(function (a, f) { return c = c && f.ownerDocument }); return c } var Q = "top right bottom left opacity height width".split(" "), H = ["top", "right", "bottom", "left"], r = ["-webkit-", "-moz-", "-o-", ""], R = ["avoidTransforms", "useTranslate3d", "leaveTransforms"],
    S = /^([+-]=)?([\d+-.]+)(.*)$/, T = /([A-Z])/g, U = { secondary: {}, meta: { top: 0, right: 0, bottom: 0, left: 0 } }, M = null, F = !1, A = (document.body || document.documentElement).style, N = void 0 !== A.WebkitTransition || void 0 !== A.MozTransition || void 0 !== A.OTransition || void 0 !== A.transition, K = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix, y = K; c.expr && c.expr.filters && (M = c.expr.filters.animated, c.expr.filters.animated = function (a) {
        return c(a).data("events") && c(a).data("events")["webkitTransitionEnd oTransitionEnd transitionend"] ?
        !0 : M.call(this, a)
    }); c.extend({ toggle3DByDefault: function () { return y = !y }, toggleDisabledByDefault: function () { return F = !F } }); c.fn.translation = function () { if (!this[0]) return null; var a = window.getComputedStyle(this[0], null), c = { x: 0, y: 0 }; if (a) for (var n = r.length - 1; 0 <= n; n--) { var f = a.getPropertyValue(r[n] + "transform"); if (f && /matrix/i.test(f)) { a = f.replace(/^matrix\(/i, "").split(/, |\)$/g); c = { x: parseInt(a[4], 10), y: parseInt(a[5], 10) }; break } } return c }; c.fn.animate = function (a, b, n, f) {
        var a = a || {}, l = !("undefined" !==
        typeof a.bottom || "undefined" !== typeof a.right), k = c.speed(b, n, f), h = this, p = 0, q = function () { p--; 0 === p && "function" === typeof k.complete && k.complete.apply(h, arguments) }, t; if (!(t = !0 === ("undefined" !== typeof a.avoidCSSTransitions ? a.avoidCSSTransitions : F))) if (!(t = !N)) if (!(t = z(a))) { var m; a: { for (m in a) if (("width" == m || "height" == m) && ("show" == a[m] || "hide" == a[m] || "toggle" == a[m])) { m = !0; break a } m = !1 } t = m || 0 >= k.duration || !0 === c.fn.animate.defaults.avoidTransforms && !1 !== a.avoidTransforms } return t ? I.apply(this, arguments) :
        this[!0 === k.queue ? "queue" : "each"](function () {
            var g = c(this), b = c.extend({}, k), h = function (b) { var f = g.data("jQe") || { original: {} }, e = {}; if (2 == b.eventPhase) { if (!0 !== a.leaveTransforms) { for (b = r.length - 1; 0 <= b; b--) e[r[b] + "transform"] = ""; if (l && "undefined" !== typeof f.meta) for (var b = 0, d; d = H[b]; ++b) e[d] = f.meta[d + "_o"] + "px", c(this).css(d, e[d]) } g.unbind("webkitTransitionEnd oTransitionEnd transitionend").css(f.original).css(e).data("jQe", null); "hide" === a.opacity && g.css({ display: "none", opacity: "" }); q.call(this) } },
            f = {
                bounce: "cubic-bezier(0.0, 0.35, .5, 1.3)", linear: "linear", swing: "ease-in-out", easeInQuad: "cubic-bezier(0.550, 0.085, 0.680, 0.530)", easeInCubic: "cubic-bezier(0.550, 0.055, 0.675, 0.190)", easeInQuart: "cubic-bezier(0.895, 0.030, 0.685, 0.220)", easeInQuint: "cubic-bezier(0.755, 0.050, 0.855, 0.060)", easeInSine: "cubic-bezier(0.470, 0.000, 0.745, 0.715)", easeInExpo: "cubic-bezier(0.950, 0.050, 0.795, 0.035)", easeInCirc: "cubic-bezier(0.600, 0.040, 0.980, 0.335)", easeInBack: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
                easeOutQuad: "cubic-bezier(0.250, 0.460, 0.450, 0.940)", easeOutCubic: "cubic-bezier(0.215, 0.610, 0.355, 1.000)", easeOutQuart: "cubic-bezier(0.165, 0.840, 0.440, 1.000)", easeOutQuint: "cubic-bezier(0.230, 1.000, 0.320, 1.000)", easeOutSine: "cubic-bezier(0.390, 0.575, 0.565, 1.000)", easeOutExpo: "cubic-bezier(0.190, 1.000, 0.220, 1.000)", easeOutCirc: "cubic-bezier(0.075, 0.820, 0.165, 1.000)", easeOutBack: "cubic-bezier(0.175, 0.885, 0.320, 1.275)", easeInOutQuad: "cubic-bezier(0.455, 0.030, 0.515, 0.955)", easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
                easeInOutQuart: "cubic-bezier(0.770, 0.000, 0.175, 1.000)", easeInOutQuint: "cubic-bezier(0.860, 0.000, 0.070, 1.000)", easeInOutSine: "cubic-bezier(0.445, 0.050, 0.550, 0.950)", easeInOutExpo: "cubic-bezier(1.000, 0.000, 0.000, 1.000)", easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.150, 0.860)", easeInOutBack: "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
            }, m = {}, f = f[b.easing || "swing"] ? f[b.easing || "swing"] : b.easing || "swing", i; for (i in a) if (-1 === c.inArray(i, R)) {
                var n = -1 < c.inArray(i, H), j; var d = g, w = a[i], u = i, s = n && !0 !==
                a.avoidTransforms; if ("d" == u) j = void 0; else if (L(d)) {
                    var e = S.exec(w); j = "auto" === d.css(u) ? 0 : d.css(u); j = "string" == typeof j ? G(j) : j; "string" == typeof w && G(w); var s = !0 === s ? 0 : j, t = d.is(":hidden"), v = d.translation(); "left" == u && (s = parseInt(j, 10) + v.x); "right" == u && (s = parseInt(j, 10) + v.x); "top" == u && (s = parseInt(j, 10) + v.y); "bottom" == u && (s = parseInt(j, 10) + v.y); !e && "show" == w ? (s = 1, t && d.css({ display: "LI" == d.context.tagName ? "list-item" : "block", opacity: 0 })) : !e && "hide" == w && (s = 0); e ? (d = parseFloat(e[2]), e[1] && (d = ("-=" === e[1] ?
                    -1 : 1) * d + parseInt(s, 10)), j = d) : j = s
                } else j = void 0; if (e = !0 !== a.avoidTransforms) if (e = i, d = j, w = g, L(w)) { u = -1 < c.inArray(e, Q); if (("width" == e || "height" == e || "opacity" == e) && parseFloat(d) === parseFloat(w.css(e))) u = !1; e = u } else e = !1; if (e) {
                    e = g; d = i; w = b.duration; u = f; j = n && !0 === a.avoidTransforms ? j + "px" : j; var n = n && !0 !== a.avoidTransforms, s = l, t = !0 === a.useTranslate3d, v = (v = e.data("jQe")) && !z(v) ? v : c.extend(!0, {}, U), x = j; if (-1 < c.inArray(d, H)) {
                        var C = v.meta, A = G(e.css(d)) || 0, y = d + "_o", x = j - A; C[d] = x; C[y] = "auto" == e.css(d) ? 0 + x : A + x || 0;
                        v.meta = C; s && 0 === x && (x = 0 - C[y], C[d] = x, C[y] = 0)
                    } e.data("jQe", O(e, v, d, w, u, x, n, s, t))
                } else m[i] = a[i]
            } g.unbind("webkitTransitionEnd oTransitionEnd transitionend"); if ((i = g.data("jQe")) && !z(i) && !z(i.secondary)) { p++; g.css(i.properties); var F = i.secondary; setTimeout(function () { g.bind("webkitTransitionEnd oTransitionEnd transitionend", h).css(F) }) } else b.queue = !1; z(m) || (p++, I.apply(g, [m, { duration: b.duration, easing: c.easing[b.easing] ? b.easing : c.easing.swing ? "swing" : "linear", complete: q, queue: b.queue }])); return !0
        })
    };
    c.fn.animate.defaults = {}; c.fn.stop = function (a, b, n) {
        if (!N) return J.apply(this, [a, b]); a && this.queue([]); this.each(function () {
            var f = c(this), l = f.data("jQe"); if (l && !z(l)) {
                var k, h = {}; if (b) { if (h = l.secondary, !n && void 0 !== typeof l.meta.left_o || void 0 !== typeof l.meta.top_o) { h.left = void 0 !== typeof l.meta.left_o ? l.meta.left_o : "auto"; h.top = void 0 !== typeof l.meta.top_o ? l.meta.top_o : "auto"; for (k = r.length - 1; 0 <= k; k--) h[r[k] + "transform"] = "" } } else if (!z(l.secondary)) {
                    var p = window.getComputedStyle(f[0], null); if (p) for (var q in l.secondary) if (l.secondary.hasOwnProperty(q) &&
                    (q = q.replace(T, "-$1").toLowerCase(), h[q] = p.getPropertyValue(q), !n && /matrix/i.test(h[q]))) { k = h[q].replace(/^matrix\(/i, "").split(/, |\)$/g); h.left = parseFloat(k[4]) + parseFloat(f.css("left")) + "px" || "auto"; h.top = parseFloat(k[5]) + parseFloat(f.css("top")) + "px" || "auto"; for (k = r.length - 1; 0 <= k; k--) h[r[k] + "transform"] = "" }
                } f.unbind("webkitTransitionEnd oTransitionEnd transitionend"); f.css(l.original).css(h).data("jQe", null)
            } else J.apply(f, [a, b])
        }); return this
    }

    jQuery.css3Support = "v0.99"

})(jQuery, jQuery.fn.animate, jQuery.fn.stop);
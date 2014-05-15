﻿(function ($) { $.color = {}; $.color.make = function (r, g, b, a) { var o = {}; o.r = r || 0; o.g = g || 0; o.b = b || 0; o.a = a != null ? a : 1; o.add = function (c, d) { for (var i = 0; i < c.length; ++i) o[c.charAt(i)] += d; return o.normalize() }; o.scale = function (c, f) { for (var i = 0; i < c.length; ++i) o[c.charAt(i)] *= f; return o.normalize() }; o.toString = function () { if (o.a >= 1) { return "rgb(" + [o.r, o.g, o.b].join(",") + ")" } else { return "rgba(" + [o.r, o.g, o.b, o.a].join(",") + ")" } }; o.normalize = function () { function clamp(min, value, max) { return value < min ? min : value > max ? max : value } o.r = clamp(0, parseInt(o.r), 255); o.g = clamp(0, parseInt(o.g), 255); o.b = clamp(0, parseInt(o.b), 255); o.a = clamp(0, o.a, 1); return o }; o.clone = function () { return $.color.make(o.r, o.b, o.g, o.a) }; return o.normalize() }; $.color.extract = function (elem, css) { var c; do { c = elem.css(css).toLowerCase(); if (c != "" && c != "transparent") break; elem = elem.parent() } while (elem.length && !$.nodeName(elem.get(0), "body")); if (c == "rgba(0, 0, 0, 0)") c = "transparent"; return $.color.parse(c) }; $.color.parse = function (str) { var res, m = $.color.make; if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str)) return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10)); if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str)) return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10), parseFloat(res[4])); if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str)) return m(parseFloat(res[1]) * 2.55, parseFloat(res[2]) * 2.55, parseFloat(res[3]) * 2.55); if (res = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str)) return m(parseFloat(res[1]) * 2.55, parseFloat(res[2]) * 2.55, parseFloat(res[3]) * 2.55, parseFloat(res[4])); if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str)) return m(parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16)); if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str)) return m(parseInt(res[1] + res[1], 16), parseInt(res[2] + res[2], 16), parseInt(res[3] + res[3], 16)); var name = $.trim(str).toLowerCase(); if (name == "transparent") return m(255, 255, 255, 0); else { res = lookupColors[name] || [0, 0, 0]; return m(res[0], res[1], res[2]) } }; var lookupColors = { aqua: [0, 255, 255], azure: [240, 255, 255], beige: [245, 245, 220], black: [0, 0, 0], blue: [0, 0, 255], brown: [165, 42, 42], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgrey: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkviolet: [148, 0, 211], fuchsia: [255, 0, 255], gold: [255, 215, 0], green: [0, 128, 0], indigo: [75, 0, 130], khaki: [240, 230, 140], lightblue: [173, 216, 230], lightcyan: [224, 255, 255], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightyellow: [255, 255, 224], lime: [0, 255, 0], magenta: [255, 0, 255], maroon: [128, 0, 0], navy: [0, 0, 128], olive: [128, 128, 0], orange: [255, 165, 0], pink: [255, 192, 203], purple: [128, 0, 128], violet: [128, 0, 128], red: [255, 0, 0], silver: [192, 192, 192], white: [255, 255, 255], yellow: [255, 255, 0] } })(jQuery); (function ($) {
    var hasOwnProperty = Object.prototype.hasOwnProperty; function Canvas(cls, container) { var element = container.children("." + cls)[0]; if (element == null) { element = document.createElement("canvas"); element.className = cls; $(element).css({ direction: "ltr", position: "absolute", left: 0, top: 0 }).appendTo(container); if (!element.getContext) { if (window.G_vmlCanvasManager) { element = window.G_vmlCanvasManager.initElement(element) } else { throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.") } } } this.element = element; var context = this.context = element.getContext("2d"); var devicePixelRatio = window.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1; this.pixelRatio = devicePixelRatio / backingStoreRatio; this.resize(container.width(), container.height()); this.textContainer = null; this.text = {}; this._textCache = {} } Canvas.prototype.resize = function (width, height) { if (width <= 0 || height <= 0) { throw new Error("Invalid dimensions for plot, width = " + width + ", height = " + height) } var element = this.element, context = this.context, pixelRatio = this.pixelRatio; if (this.width != width) { element.width = width * pixelRatio; element.style.width = width + "px"; this.width = width } if (this.height != height) { element.height = height * pixelRatio; element.style.height = height + "px"; this.height = height } context.restore(); context.save(); context.scale(pixelRatio, pixelRatio) }; Canvas.prototype.clear = function () { this.context.clearRect(0, 0, this.width, this.height) }; Canvas.prototype.render = function () { var cache = this._textCache; for (var layerKey in cache) { if (hasOwnProperty.call(cache, layerKey)) { var layer = this.getTextLayer(layerKey), layerCache = cache[layerKey]; layer.hide(); for (var styleKey in layerCache) { if (hasOwnProperty.call(layerCache, styleKey)) { var styleCache = layerCache[styleKey]; for (var key in styleCache) { if (hasOwnProperty.call(styleCache, key)) { var positions = styleCache[key].positions; for (var i = 0, position; position = positions[i]; i++) { if (position.active) { if (!position.rendered) { layer.append(position.element); position.rendered = true } } else { positions.splice(i--, 1); if (position.rendered) { position.element.detach() } } } if (positions.length == 0) { delete styleCache[key] } } } } } layer.show() } } }; Canvas.prototype.getTextLayer = function (classes) { var layer = this.text[classes]; if (layer == null) { if (this.textContainer == null) { this.textContainer = $("<div class='flot-text'></div>").css({ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, "font-size": "smaller", color: "#545454" }).insertAfter(this.element) } layer = this.text[classes] = $("<div></div>").addClass(classes).css({ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }).appendTo(this.textContainer) } return layer }; Canvas.prototype.getTextInfo = function (layer, text, font, angle, width) { var textStyle, layerCache, styleCache, info; text = "" + text; if (typeof font === "object") { textStyle = font.style + " " + font.variant + " " + font.weight + " " + font.size + "px/" + font.lineHeight + "px " + font.family } else { textStyle = font } layerCache = this._textCache[layer]; if (layerCache == null) { layerCache = this._textCache[layer] = {} } styleCache = layerCache[textStyle]; if (styleCache == null) { styleCache = layerCache[textStyle] = {} } info = styleCache[text]; if (info == null) { var element = $("<div></div>").html(text).css({ position: "absolute", "max-width": width, top: -9999 }).appendTo(this.getTextLayer(layer)); if (typeof font === "object") { element.css({ font: textStyle, color: font.color }) } else if (typeof font === "string") { element.addClass(font) } info = styleCache[text] = { width: element.outerWidth(true), height: element.outerHeight(true), element: element, positions: [] }; element.detach() } return info }; Canvas.prototype.addText = function (layer, x, y, text, font, angle, width, halign, valign) { var info = this.getTextInfo(layer, text, font, angle, width), positions = info.positions; if (halign == "center") { x -= info.width / 2 } else if (halign == "right") { x -= info.width } if (valign == "middle") { y -= info.height / 2 } else if (valign == "bottom") { y -= info.height } for (var i = 0, position; position = positions[i]; i++) { if (position.x == x && position.y == y) { position.active = true; return } } position = { active: true, rendered: false, element: positions.length ? info.element.clone() : info.element, x: x, y: y }; positions.push(position); position.element.css({ top: Math.round(y), left: Math.round(x), "text-align": halign }) }; Canvas.prototype.removeText = function (layer, x, y, text, font, angle) { if (text == null) { var layerCache = this._textCache[layer]; if (layerCache != null) { for (var styleKey in layerCache) { if (hasOwnProperty.call(layerCache, styleKey)) { var styleCache = layerCache[styleKey]; for (var key in styleCache) { if (hasOwnProperty.call(styleCache, key)) { var positions = styleCache[key].positions; for (var i = 0, position; position = positions[i]; i++) { position.active = false } } } } } } } else { var positions = this.getTextInfo(layer, text, font, angle).positions; for (var i = 0, position; position = positions[i]; i++) { if (position.x == x && position.y == y) { position.active = false } } } }; function Plot(placeholder, data_, options_, plugins) {
        var series = [], options = { colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"], legend: { show: true, noColumns: 1, labelFormatter: null, labelBoxBorderColor: "#ccc", container: null, position: "ne", margin: 5, backgroundColor: null, backgroundOpacity: .85, sorted: null }, xaxis: { show: null, position: "bottom", mode: null, font: null, color: null, tickColor: null, transform: null, inverseTransform: null, min: null, max: null, autoscaleMargin: null, ticks: null, tickFormatter: null, labelWidth: null, labelHeight: null, reserveSpace: null, tickLength: null, alignTicksWithAxis: null, tickDecimals: null, tickSize: null, minTickSize: null }, yaxis: { autoscaleMargin: .02, position: "left" }, xaxes: [], yaxes: [], series: { points: { show: false, radius: 3, lineWidth: 2, fill: true, fillColor: "#ffffff", symbol: "circle" }, lines: { lineWidth: 2, fill: false, fillColor: null, steps: false }, bars: { show: false, lineWidth: 2, barWidth: 1, fill: true, fillColor: null, align: "left", horizontal: false, zero: true }, shadowSize: 3, highlightColor: null }, grid: { show: true, aboveData: false, color: "#545454", backgroundColor: null, borderColor: null, tickColor: null, margin: 0, labelMargin: 5, axisMargin: 8, borderWidth: 2, minBorderMargin: null, markings: null, markingsColor: "#f4f4f4", markingsLineWidth: 2, clickable: false, hoverable: false, autoHighlight: true, mouseActiveRadius: 10 }, interaction: { redrawOverlayInterval: 1e3 / 60 }, hooks: {} }, surface = null, overlay = null, eventHolder = null, ctx = null, octx = null, xaxes = [], yaxes = [], plotOffset = { left: 0, right: 0, top: 0, bottom: 0 }, plotWidth = 0, plotHeight = 0, hooks = { processOptions: [], processRawData: [], processDatapoints: [], processOffset: [], drawBackground: [], drawSeries: [], draw: [], bindEvents: [], drawOverlay: [], shutdown: [] }, plot = this; plot.setData = setData; plot.setupGrid = setupGrid; plot.draw = draw; plot.getPlaceholder = function () { return placeholder }; plot.getCanvas = function () { return surface.element }; plot.getPlotOffset = function () { return plotOffset }; plot.width = function () { return plotWidth }; plot.height = function () { return plotHeight }; plot.offset = function () { var o = eventHolder.offset(); o.left += plotOffset.left; o.top += plotOffset.top; return o }; plot.getData = function () { return series }; plot.getAxes = function () { var res = {}, i; $.each(xaxes.concat(yaxes), function (_, axis) { if (axis) res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis }); return res }; plot.getXAxes = function () { return xaxes }; plot.getYAxes = function () { return yaxes }; plot.c2p = canvasToAxisCoords; plot.p2c = axisToCanvasCoords; plot.getOptions = function () { return options }; plot.highlight = highlight; plot.unhighlight = unhighlight; plot.triggerRedrawOverlay = triggerRedrawOverlay; plot.pointOffset = function (point) { return { left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left, 10), top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top, 10) } }; plot.shutdown = shutdown; plot.destroy = function () { shutdown(); placeholder.removeData("plot").empty(); series = []; options = null; surface = null; overlay = null; eventHolder = null; ctx = null; octx = null; xaxes = []; yaxes = []; hooks = null; highlights = []; plot = null }; plot.resize = function () { var width = placeholder.width(), height = placeholder.height(); surface.resize(width, height); overlay.resize(width, height) }; plot.hooks = hooks; initPlugins(plot); parseOptions(options_); setupCanvases(); setData(data_); setupGrid(); draw(); bindEvents(); function executeHooks(hook, args) { args = [plot].concat(args); for (var i = 0; i < hook.length; ++i) hook[i].apply(this, args) } function initPlugins() { var classes = { Canvas: Canvas }; for (var i = 0; i < plugins.length; ++i) { var p = plugins[i]; p.init(plot, classes); if (p.options) $.extend(true, options, p.options) } } function parseOptions(opts) { $.extend(true, options, opts); if (opts && opts.colors) { options.colors = opts.colors } if (options.xaxis.color == null) options.xaxis.color = $.color.parse(options.grid.color).scale("a", .22).toString(); if (options.yaxis.color == null) options.yaxis.color = $.color.parse(options.grid.color).scale("a", .22).toString(); if (options.xaxis.tickColor == null) options.xaxis.tickColor = options.grid.tickColor || options.xaxis.color; if (options.yaxis.tickColor == null) options.yaxis.tickColor = options.grid.tickColor || options.yaxis.color; if (options.grid.borderColor == null) options.grid.borderColor = options.grid.color; if (options.grid.tickColor == null) options.grid.tickColor = $.color.parse(options.grid.color).scale("a", .22).toString(); var i, axisOptions, axisCount, fontSize = placeholder.css("font-size"), fontSizeDefault = fontSize ? +fontSize.replace("px", "") : 13, fontDefaults = { style: placeholder.css("font-style"), size: Math.round(.8 * fontSizeDefault), variant: placeholder.css("font-variant"), weight: placeholder.css("font-weight"), family: placeholder.css("font-family") }; axisCount = options.xaxes.length || 1; for (i = 0; i < axisCount; ++i) { axisOptions = options.xaxes[i]; if (axisOptions && !axisOptions.tickColor) { axisOptions.tickColor = axisOptions.color } axisOptions = $.extend(true, {}, options.xaxis, axisOptions); options.xaxes[i] = axisOptions; if (axisOptions.font) { axisOptions.font = $.extend({}, fontDefaults, axisOptions.font); if (!axisOptions.font.color) { axisOptions.font.color = axisOptions.color } if (!axisOptions.font.lineHeight) { axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15) } } } axisCount = options.yaxes.length || 1; for (i = 0; i < axisCount; ++i) { axisOptions = options.yaxes[i]; if (axisOptions && !axisOptions.tickColor) { axisOptions.tickColor = axisOptions.color } axisOptions = $.extend(true, {}, options.yaxis, axisOptions); options.yaxes[i] = axisOptions; if (axisOptions.font) { axisOptions.font = $.extend({}, fontDefaults, axisOptions.font); if (!axisOptions.font.color) { axisOptions.font.color = axisOptions.color } if (!axisOptions.font.lineHeight) { axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15) } } } if (options.xaxis.noTicks && options.xaxis.ticks == null) options.xaxis.ticks = options.xaxis.noTicks; if (options.yaxis.noTicks && options.yaxis.ticks == null) options.yaxis.ticks = options.yaxis.noTicks; if (options.x2axis) { options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis); options.xaxes[1].position = "top" } if (options.y2axis) { options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis); options.yaxes[1].position = "right" } if (options.grid.coloredAreas) options.grid.markings = options.grid.coloredAreas; if (options.grid.coloredAreasColor) options.grid.markingsColor = options.grid.coloredAreasColor; if (options.lines) $.extend(true, options.series.lines, options.lines); if (options.points) $.extend(true, options.series.points, options.points); if (options.bars) $.extend(true, options.series.bars, options.bars); if (options.shadowSize != null) options.series.shadowSize = options.shadowSize; if (options.highlightColor != null) options.series.highlightColor = options.highlightColor; for (i = 0; i < options.xaxes.length; ++i) getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i]; for (i = 0; i < options.yaxes.length; ++i) getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i]; for (var n in hooks) if (options.hooks[n] && options.hooks[n].length) hooks[n] = hooks[n].concat(options.hooks[n]); executeHooks(hooks.processOptions, [options]) } function setData(d) { series = parseData(d); fillInSeriesOptions(); processData() } function parseData(d) { var res = []; for (var i = 0; i < d.length; ++i) { var s = $.extend(true, {}, options.series); if (d[i].data != null) { s.data = d[i].data; delete d[i].data; $.extend(true, s, d[i]); d[i].data = s.data } else s.data = d[i]; res.push(s) } return res } function axisNumber(obj, coord) { var a = obj[coord + "axis"]; if (typeof a == "object") a = a.n; if (typeof a != "number") a = 1; return a } function allAxes() { return $.grep(xaxes.concat(yaxes), function (a) { return a }) } function canvasToAxisCoords(pos) { var res = {}, i, axis; for (i = 0; i < xaxes.length; ++i) { axis = xaxes[i]; if (axis && axis.used) res["x" + axis.n] = axis.c2p(pos.left) } for (i = 0; i < yaxes.length; ++i) { axis = yaxes[i]; if (axis && axis.used) res["y" + axis.n] = axis.c2p(pos.top) } if (res.x1 !== undefined) res.x = res.x1; if (res.y1 !== undefined) res.y = res.y1; return res } function axisToCanvasCoords(pos) { var res = {}, i, axis, key; for (i = 0; i < xaxes.length; ++i) { axis = xaxes[i]; if (axis && axis.used) { key = "x" + axis.n; if (pos[key] == null && axis.n == 1) key = "x"; if (pos[key] != null) { res.left = axis.p2c(pos[key]); break } } } for (i = 0; i < yaxes.length; ++i) { axis = yaxes[i]; if (axis && axis.used) { key = "y" + axis.n; if (pos[key] == null && axis.n == 1) key = "y"; if (pos[key] != null) { res.top = axis.p2c(pos[key]); break } } } return res } function getOrCreateAxis(axes, number) { if (!axes[number - 1]) axes[number - 1] = { n: number, direction: axes == xaxes ? "x" : "y", options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis) }; return axes[number - 1] } function fillInSeriesOptions() { var neededColors = series.length, maxIndex = -1, i; for (i = 0; i < series.length; ++i) { var sc = series[i].color; if (sc != null) { neededColors--; if (typeof sc == "number" && sc > maxIndex) { maxIndex = sc } } } if (neededColors <= maxIndex) { neededColors = maxIndex + 1 } var c, colors = [], colorPool = options.colors, colorPoolSize = colorPool.length, variation = 0; for (i = 0; i < neededColors; i++) { c = $.color.parse(colorPool[i % colorPoolSize] || "#666"); if (i % colorPoolSize == 0 && i) { if (variation >= 0) { if (variation < .5) { variation = -variation - .2 } else variation = 0 } else variation = -variation } colors[i] = c.scale("rgb", 1 + variation) } var colori = 0, s; for (i = 0; i < series.length; ++i) { s = series[i]; if (s.color == null) { s.color = colors[colori].toString(); ++colori } else if (typeof s.color == "number") s.color = colors[s.color].toString(); if (s.lines.show == null) { var v, show = true; for (v in s) if (s[v] && s[v].show) { show = false; break } if (show) s.lines.show = true } if (s.lines.zero == null) { s.lines.zero = !!s.lines.fill } s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x")); s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y")) } } function processData() { var topSentry = Number.POSITIVE_INFINITY, bottomSentry = Number.NEGATIVE_INFINITY, fakeInfinity = Number.MAX_VALUE, i, j, k, m, length, s, points, ps, x, y, axis, val, f, p, data, format; function updateAxis(axis, min, max) { if (min < axis.datamin && min != -fakeInfinity) axis.datamin = min; if (max > axis.datamax && max != fakeInfinity) axis.datamax = max } $.each(allAxes(), function (_, axis) { axis.datamin = topSentry; axis.datamax = bottomSentry; axis.used = false }); for (i = 0; i < series.length; ++i) { s = series[i]; s.datapoints = { points: [] }; executeHooks(hooks.processRawData, [s, s.data, s.datapoints]) } for (i = 0; i < series.length; ++i) { s = series[i]; data = s.data; format = s.datapoints.format; if (!format) { format = []; format.push({ x: true, number: true, required: true }); format.push({ y: true, number: true, required: true }); if (s.bars.show || s.lines.show && s.lines.fill) { var autoscale = !!(s.bars.show && s.bars.zero || s.lines.show && s.lines.zero); format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale }); if (s.bars.horizontal) { delete format[format.length - 1].y; format[format.length - 1].x = true } } s.datapoints.format = format } if (s.datapoints.pointsize != null) continue; s.datapoints.pointsize = format.length; ps = s.datapoints.pointsize; points = s.datapoints.points; var insertSteps = s.lines.show && s.lines.steps; s.xaxis.used = s.yaxis.used = true; for (j = k = 0; j < data.length; ++j, k += ps) { p = data[j]; var nullify = p == null; if (!nullify) { for (m = 0; m < ps; ++m) { val = p[m]; f = format[m]; if (f) { if (f.number && val != null) { val = +val; if (isNaN(val)) val = null; else if (val == Infinity) val = fakeInfinity; else if (val == -Infinity) val = -fakeInfinity } if (val == null) { if (f.required) nullify = true; if (f.defaultValue != null) val = f.defaultValue } } points[k + m] = val } } if (nullify) { for (m = 0; m < ps; ++m) { val = points[k + m]; if (val != null) { f = format[m]; if (f.autoscale !== false) { if (f.x) { updateAxis(s.xaxis, val, val) } if (f.y) { updateAxis(s.yaxis, val, val) } } } points[k + m] = null } } else { if (insertSteps && k > 0 && points[k - ps] != null && points[k - ps] != points[k] && points[k - ps + 1] != points[k + 1]) { for (m = 0; m < ps; ++m) points[k + ps + m] = points[k + m]; points[k + 1] = points[k - ps + 1]; k += ps } } } } for (i = 0; i < series.length; ++i) { s = series[i]; executeHooks(hooks.processDatapoints, [s, s.datapoints]) } for (i = 0; i < series.length; ++i) { s = series[i]; points = s.datapoints.points; ps = s.datapoints.pointsize; format = s.datapoints.format; var xmin = topSentry, ymin = topSentry, xmax = bottomSentry, ymax = bottomSentry; for (j = 0; j < points.length; j += ps) { if (points[j] == null) continue; for (m = 0; m < ps; ++m) { val = points[j + m]; f = format[m]; if (!f || f.autoscale === false || val == fakeInfinity || val == -fakeInfinity) continue; if (f.x) { if (val < xmin) xmin = val; if (val > xmax) xmax = val } if (f.y) { if (val < ymin) ymin = val; if (val > ymax) ymax = val } } } if (s.bars.show) { var delta; switch (s.bars.align) { case "left": delta = 0; break; case "right": delta = -s.bars.barWidth; break; default: delta = -s.bars.barWidth / 2 } if (s.bars.horizontal) { ymin += delta; ymax += delta + s.bars.barWidth } else { xmin += delta; xmax += delta + s.bars.barWidth } } updateAxis(s.xaxis, xmin, xmax); updateAxis(s.yaxis, ymin, ymax) } $.each(allAxes(), function (_, axis) { if (axis.datamin == topSentry) axis.datamin = null; if (axis.datamax == bottomSentry) axis.datamax = null }) } function setupCanvases() { placeholder.css("padding", 0).children().filter(function () { return !$(this).hasClass("flot-overlay") && !$(this).hasClass("flot-base") }).remove(); if (placeholder.css("position") == "static") placeholder.css("position", "relative"); surface = new Canvas("flot-base", placeholder); overlay = new Canvas("flot-overlay", placeholder); ctx = surface.context; octx = overlay.context; eventHolder = $(overlay.element).unbind(); var existing = placeholder.data("plot"); if (existing) { existing.shutdown(); overlay.clear() } placeholder.data("plot", plot) } function bindEvents() { if (options.grid.hoverable) { eventHolder.mousemove(onMouseMove); eventHolder.bind("mouseleave", onMouseLeave) } if (options.grid.clickable) eventHolder.click(onClick); executeHooks(hooks.bindEvents, [eventHolder]) } function shutdown() { if (redrawTimeout) clearTimeout(redrawTimeout); eventHolder.unbind("mousemove", onMouseMove); eventHolder.unbind("mouseleave", onMouseLeave); eventHolder.unbind("click", onClick); executeHooks(hooks.shutdown, [eventHolder]) } function setTransformationHelpers(axis) { function identity(x) { return x } var s, m, t = axis.options.transform || identity, it = axis.options.inverseTransform; if (axis.direction == "x") { s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min)); m = Math.min(t(axis.max), t(axis.min)) } else { s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min)); s = -s; m = Math.max(t(axis.max), t(axis.min)) } if (t == identity) axis.p2c = function (p) { return (p - m) * s }; else axis.p2c = function (p) { return (t(p) - m) * s }; if (!it) axis.c2p = function (c) { return m + c / s }; else axis.c2p = function (c) { return it(m + c / s) } } function measureTickLabels(axis) { var opts = axis.options, ticks = axis.ticks || [], labelWidth = opts.labelWidth || 0, labelHeight = opts.labelHeight || 0, maxWidth = labelWidth || (axis.direction == "x" ? Math.floor(surface.width / (ticks.length || 1)) : null), legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis", layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles, font = opts.font || "flot-tick-label tickLabel"; for (var i = 0; i < ticks.length; ++i) { var t = ticks[i]; if (!t.label) continue; var info = surface.getTextInfo(layer, t.label, font, null, maxWidth); labelWidth = Math.max(labelWidth, info.width); labelHeight = Math.max(labelHeight, info.height) } axis.labelWidth = opts.labelWidth || labelWidth; axis.labelHeight = opts.labelHeight || labelHeight } function allocateAxisBoxFirstPhase(axis) { var lw = axis.labelWidth, lh = axis.labelHeight, pos = axis.options.position, isXAxis = axis.direction === "x", tickLength = axis.options.tickLength, axisMargin = options.grid.axisMargin, padding = options.grid.labelMargin, innermost = true, outermost = true, first = true, found = false; $.each(isXAxis ? xaxes : yaxes, function (i, a) { if (a && a.reserveSpace) { if (a === axis) { found = true } else if (a.options.position === pos) { if (found) { outermost = false } else { innermost = false } } if (!found) { first = false } } }); if (outermost) { axisMargin = 0 } if (tickLength == null) { tickLength = first ? "full" : 5 } if (!isNaN(+tickLength)) padding += +tickLength; if (isXAxis) { lh += padding; if (pos == "bottom") { plotOffset.bottom += lh + axisMargin; axis.box = { top: surface.height - plotOffset.bottom, height: lh } } else { axis.box = { top: plotOffset.top + axisMargin, height: lh }; plotOffset.top += lh + axisMargin } } else { lw += padding; if (pos == "left") { axis.box = { left: plotOffset.left + axisMargin, width: lw }; plotOffset.left += lw + axisMargin } else { plotOffset.right += lw + axisMargin; axis.box = { left: surface.width - plotOffset.right, width: lw } } } axis.position = pos; axis.tickLength = tickLength; axis.box.padding = padding; axis.innermost = innermost } function allocateAxisBoxSecondPhase(axis) { if (axis.direction == "x") { axis.box.left = plotOffset.left - axis.labelWidth / 2; axis.box.width = surface.width - plotOffset.left - plotOffset.right + axis.labelWidth } else { axis.box.top = plotOffset.top - axis.labelHeight / 2; axis.box.height = surface.height - plotOffset.bottom - plotOffset.top + axis.labelHeight } } function adjustLayoutForThingsStickingOut() { var minMargin = options.grid.minBorderMargin, axis, i; if (minMargin == null) { minMargin = 0; for (i = 0; i < series.length; ++i) minMargin = Math.max(minMargin, 2 * (series[i].points.radius + series[i].points.lineWidth / 2)) } var margins = { left: minMargin, right: minMargin, top: minMargin, bottom: minMargin }; $.each(allAxes(), function (_, axis) { if (axis.reserveSpace && axis.ticks && axis.ticks.length) { var lastTick = axis.ticks[axis.ticks.length - 1]; if (axis.direction === "x") { margins.left = Math.max(margins.left, axis.labelWidth / 2); if (lastTick.v <= axis.max) { margins.right = Math.max(margins.right, axis.labelWidth / 2) } } else { margins.bottom = Math.max(margins.bottom, axis.labelHeight / 2); if (lastTick.v <= axis.max) { margins.top = Math.max(margins.top, axis.labelHeight / 2) } } } }); plotOffset.left = Math.ceil(Math.max(margins.left, plotOffset.left)); plotOffset.right = Math.ceil(Math.max(margins.right, plotOffset.right)); plotOffset.top = Math.ceil(Math.max(margins.top, plotOffset.top)); plotOffset.bottom = Math.ceil(Math.max(margins.bottom, plotOffset.bottom)) } function setupGrid() { var i, axes = allAxes(), showGrid = options.grid.show; for (var a in plotOffset) { var margin = options.grid.margin || 0; plotOffset[a] = typeof margin == "number" ? margin : margin[a] || 0 } executeHooks(hooks.processOffset, [plotOffset]); for (var a in plotOffset) { if (typeof options.grid.borderWidth == "object") { plotOffset[a] += showGrid ? options.grid.borderWidth[a] : 0 } else { plotOffset[a] += showGrid ? options.grid.borderWidth : 0 } } $.each(axes, function (_, axis) { axis.show = axis.options.show; if (axis.show == null) axis.show = axis.used; axis.reserveSpace = axis.show || axis.options.reserveSpace; setRange(axis) }); if (showGrid) { var allocatedAxes = $.grep(axes, function (axis) { return axis.reserveSpace }); $.each(allocatedAxes, function (_, axis) { setupTickGeneration(axis); setTicks(axis); snapRangeToTicks(axis, axis.ticks); measureTickLabels(axis) }); for (i = allocatedAxes.length - 1; i >= 0; --i) allocateAxisBoxFirstPhase(allocatedAxes[i]); adjustLayoutForThingsStickingOut(); $.each(allocatedAxes, function (_, axis) { allocateAxisBoxSecondPhase(axis) }) } plotWidth = surface.width - plotOffset.left - plotOffset.right; plotHeight = surface.height - plotOffset.bottom - plotOffset.top; $.each(axes, function (_, axis) { setTransformationHelpers(axis) }); if (showGrid) { drawAxisLabels() } insertLegend() } function setRange(axis) { var opts = axis.options, min = +(opts.min != null ? opts.min : axis.datamin), max = +(opts.max != null ? opts.max : axis.datamax), delta = max - min; if (delta == 0) { var widen = max == 0 ? 1 : .01; if (opts.min == null) min -= widen; if (opts.max == null || opts.min != null) max += widen } else { var margin = opts.autoscaleMargin; if (margin != null) { if (opts.min == null) { min -= delta * margin; if (min < 0 && axis.datamin != null && axis.datamin >= 0) min = 0 } if (opts.max == null) { max += delta * margin; if (max > 0 && axis.datamax != null && axis.datamax <= 0) max = 0 } } } axis.min = min; axis.max = max } function setupTickGeneration(axis) { var opts = axis.options; var noTicks; if (typeof opts.ticks == "number" && opts.ticks > 0) noTicks = opts.ticks; else noTicks = .3 * Math.sqrt(axis.direction == "x" ? surface.width : surface.height); var delta = (axis.max - axis.min) / noTicks, dec = -Math.floor(Math.log(delta) / Math.LN10), maxDec = opts.tickDecimals; if (maxDec != null && dec > maxDec) { dec = maxDec } var magn = Math.pow(10, -dec), norm = delta / magn, size; if (norm < 1.5) { size = 1 } else if (norm < 3) { size = 2; if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) { size = 2.5; ++dec } } else if (norm < 7.5) { size = 5 } else { size = 10 } size *= magn; if (opts.minTickSize != null && size < opts.minTickSize) { size = opts.minTickSize } axis.delta = delta; axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec); axis.tickSize = opts.tickSize || size; /*if (opts.mode == "time" && !axis.tickGenerator) { throw new Error("Time mode requires the flot.time plugin.") }*/ if (!axis.tickGenerator) { axis.tickGenerator = function (axis) { var ticks = [], start = floorInBase(axis.min, axis.tickSize), i = 0, v = Number.NaN, prev; do { prev = v; v = start + i * axis.tickSize; ticks.push(v); ++i } while (v < axis.max && v != prev); return ticks }; axis.tickFormatter = function (value, axis) { var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1; var formatted = "" + Math.round(value * factor) / factor; if (axis.tickDecimals != null) { var decimal = formatted.indexOf("."); var precision = decimal == -1 ? 0 : formatted.length - decimal - 1; if (precision < axis.tickDecimals) { return (precision ? formatted : formatted + ".") + ("" + factor).substr(1, axis.tickDecimals - precision) } } return formatted } } if ($.isFunction(opts.tickFormatter)) axis.tickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis) }; if (opts.alignTicksWithAxis != null) { var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1]; if (otherAxis && otherAxis.used && otherAxis != axis) { var niceTicks = axis.tickGenerator(axis); if (niceTicks.length > 0) { if (opts.min == null) axis.min = Math.min(axis.min, niceTicks[0]); if (opts.max == null && niceTicks.length > 1) axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]) } axis.tickGenerator = function (axis) { var ticks = [], v, i; for (i = 0; i < otherAxis.ticks.length; ++i) { v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min); v = axis.min + v * (axis.max - axis.min); ticks.push(v) } return ticks }; if (!axis.mode && opts.tickDecimals == null) { var extraDec = Math.max(0, -Math.floor(Math.log(axis.delta) / Math.LN10) + 1), ts = axis.tickGenerator(axis); if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec)))) axis.tickDecimals = extraDec } } } } function setTicks(axis) { var oticks = axis.options.ticks, ticks = []; if (oticks == null || typeof oticks == "number" && oticks > 0) ticks = axis.tickGenerator(axis); else if (oticks) { if ($.isFunction(oticks)) ticks = oticks(axis); else ticks = oticks } var i, v; axis.ticks = []; for (i = 0; i < ticks.length; ++i) { var label = null; var t = ticks[i]; if (typeof t == "object") { v = +t[0]; if (t.length > 1) label = t[1] } else v = +t; if (label == null) label = axis.tickFormatter(v, axis); if (!isNaN(v)) axis.ticks.push({ v: v, label: label }) } } function snapRangeToTicks(axis, ticks) { if (axis.options.autoscaleMargin && ticks.length > 0) { if (axis.options.min == null) axis.min = Math.min(axis.min, ticks[0].v); if (axis.options.max == null && ticks.length > 1) axis.max = Math.max(axis.max, ticks[ticks.length - 1].v) } } function draw() { surface.clear(); executeHooks(hooks.drawBackground, [ctx]); var grid = options.grid; if (grid.show && grid.backgroundColor) drawBackground(); if (grid.show && !grid.aboveData) { drawGrid() } for (var i = 0; i < series.length; ++i) { executeHooks(hooks.drawSeries, [ctx, series[i]]); drawSeries(series[i]) } executeHooks(hooks.draw, [ctx]); if (grid.show && grid.aboveData) { drawGrid() } surface.render(); triggerRedrawOverlay() } function extractRange(ranges, coord) { var axis, from, to, key, axes = allAxes(); for (var i = 0; i < axes.length; ++i) { axis = axes[i]; if (axis.direction == coord) { key = coord + axis.n + "axis"; if (!ranges[key] && axis.n == 1) key = coord + "axis"; if (ranges[key]) { from = ranges[key].from; to = ranges[key].to; break } } } if (!ranges[key]) { axis = coord == "x" ? xaxes[0] : yaxes[0]; from = ranges[coord + "1"]; to = ranges[coord + "2"] } if (from != null && to != null && from > to) { var tmp = from; from = to; to = tmp } return { from: from, to: to, axis: axis } } function drawBackground() { ctx.save(); ctx.translate(plotOffset.left, plotOffset.top); ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)"); ctx.fillRect(0, 0, plotWidth, plotHeight); ctx.restore() } function drawGrid() {
            var i, axes, bw, bc; ctx.save(); ctx.translate(plotOffset.left, plotOffset.top); var markings = options.grid.markings; if (markings) {
                if ($.isFunction(markings)) { axes = plot.getAxes(); axes.xmin = axes.xaxis.min; axes.xmax = axes.xaxis.max; axes.ymin = axes.yaxis.min; axes.ymax = axes.yaxis.max; markings = markings(axes) } for (i = 0; i < markings.length; ++i) {
                    var m = markings[i], xrange = extractRange(m, "x"), yrange = extractRange(m, "y"); if (xrange.from == null) xrange.from = xrange.axis.min; if (xrange.to == null) xrange.to = xrange.axis.max; if (yrange.from == null) yrange.from = yrange.axis.min; if (yrange.to == null) yrange.to = yrange.axis.max; if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max || yrange.to < yrange.axis.min || yrange.from > yrange.axis.max) continue; xrange.from = Math.max(xrange.from, xrange.axis.min); xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min); yrange.to = Math.min(yrange.to, yrange.axis.max); if (xrange.from == xrange.to && yrange.from == yrange.to) continue; xrange.from = xrange.axis.p2c(xrange.from); xrange.to = xrange.axis.p2c(xrange.to); yrange.from = yrange.axis.p2c(yrange.from); yrange.to = yrange.axis.p2c(yrange.to); if (xrange.from == xrange.to || yrange.from == yrange.to) { ctx.beginPath(); ctx.strokeStyle = m.color || options.grid.markingsColor; ctx.lineWidth = m.lineWidth || options.grid.markingsLineWidth; ctx.moveTo(xrange.from, yrange.from); ctx.lineTo(xrange.to, yrange.to); ctx.stroke() } else { ctx.fillStyle = m.color || options.grid.markingsColor; ctx.fillRect(xrange.from, yrange.to, xrange.to - xrange.from, yrange.from - yrange.to) }
                }
            } axes = allAxes(); bw = options.grid.borderWidth; for (var j = 0; j < axes.length; ++j) { var axis = axes[j], box = axis.box, t = axis.tickLength, x, y, xoff, yoff; if (!axis.show || axis.ticks.length == 0) continue; ctx.lineWidth = 1; if (axis.direction == "x") { x = 0; if (t == "full") y = axis.position == "top" ? 0 : plotHeight; else y = box.top - plotOffset.top + (axis.position == "top" ? box.height : 0) } else { y = 0; if (t == "full") x = axis.position == "left" ? 0 : plotWidth; else x = box.left - plotOffset.left + (axis.position == "left" ? box.width : 0) } if (!axis.innermost) { ctx.strokeStyle = axis.options.color; ctx.beginPath(); xoff = yoff = 0; if (axis.direction == "x") xoff = plotWidth + 1; else yoff = plotHeight + 1; if (ctx.lineWidth == 1) { if (axis.direction == "x") { y = Math.floor(y) + .5 } else { x = Math.floor(x) + .5 } } ctx.moveTo(x, y); ctx.lineTo(x + xoff, y + yoff); ctx.stroke() } ctx.strokeStyle = axis.options.tickColor; ctx.beginPath(); for (i = 0; i < axis.ticks.length; ++i) { var v = axis.ticks[i].v; xoff = yoff = 0; if (isNaN(v) || v < axis.min || v > axis.max || t == "full" && (typeof bw == "object" && bw[axis.position] > 0 || bw > 0) && (v == axis.min || v == axis.max)) continue; if (axis.direction == "x") { x = axis.p2c(v); yoff = t == "full" ? -plotHeight : t; if (axis.position == "top") yoff = -yoff } else { y = axis.p2c(v); xoff = t == "full" ? -plotWidth : t; if (axis.position == "left") xoff = -xoff } if (ctx.lineWidth == 1) { if (axis.direction == "x") x = Math.floor(x) + .5; else y = Math.floor(y) + .5 } ctx.moveTo(x, y); ctx.lineTo(x + xoff, y + yoff) } ctx.stroke() } if (bw) { bc = options.grid.borderColor; if (typeof bw == "object" || typeof bc == "object") { if (typeof bw !== "object") { bw = { top: bw, right: bw, bottom: bw, left: bw } } if (typeof bc !== "object") { bc = { top: bc, right: bc, bottom: bc, left: bc } } if (bw.top > 0) { ctx.strokeStyle = bc.top; ctx.lineWidth = bw.top; ctx.beginPath(); ctx.moveTo(0 - bw.left, 0 - bw.top / 2); ctx.lineTo(plotWidth, 0 - bw.top / 2); ctx.stroke() } if (bw.right > 0) { ctx.strokeStyle = bc.right; ctx.lineWidth = bw.right; ctx.beginPath(); ctx.moveTo(plotWidth + bw.right / 2, 0 - bw.top); ctx.lineTo(plotWidth + bw.right / 2, plotHeight); ctx.stroke() } if (bw.bottom > 0) { ctx.strokeStyle = bc.bottom; ctx.lineWidth = bw.bottom; ctx.beginPath(); ctx.moveTo(plotWidth + bw.right, plotHeight + bw.bottom / 2); ctx.lineTo(0, plotHeight + bw.bottom / 2); ctx.stroke() } if (bw.left > 0) { ctx.strokeStyle = bc.left; ctx.lineWidth = bw.left; ctx.beginPath(); ctx.moveTo(0 - bw.left / 2, plotHeight + bw.bottom); ctx.lineTo(0 - bw.left / 2, 0); ctx.stroke() } } else { ctx.lineWidth = bw; ctx.strokeStyle = options.grid.borderColor; ctx.strokeRect(-bw / 2, -bw / 2, plotWidth + bw, plotHeight + bw) } } ctx.restore()
        } function drawAxisLabels() { $.each(allAxes(), function (_, axis) { var box = axis.box, legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis", layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles, font = axis.options.font || "flot-tick-label tickLabel", tick, x, y, halign, valign; surface.removeText(layer); if (!axis.show || axis.ticks.length == 0) return; for (var i = 0; i < axis.ticks.length; ++i) { tick = axis.ticks[i]; if (!tick.label || tick.v < axis.min || tick.v > axis.max) continue; if (axis.direction == "x") { halign = "center"; x = plotOffset.left + axis.p2c(tick.v); if (axis.position == "bottom") { y = box.top + box.padding } else { y = box.top + box.height - box.padding; valign = "bottom" } } else { valign = "middle"; y = plotOffset.top + axis.p2c(tick.v); if (axis.position == "left") { x = box.left + box.width - box.padding; halign = "right" } else { x = box.left + box.padding } } surface.addText(layer, x, y, tick.label, font, null, null, halign, valign) } }) } function drawSeries(series) { if (series.lines.show) drawSeriesLines(series); if (series.bars.show) drawSeriesBars(series); if (series.points.show) drawSeriesPoints(series) } function drawSeriesLines(series) { function plotLine(datapoints, xoffset, yoffset, axisx, axisy) { var points = datapoints.points, ps = datapoints.pointsize, prevx = null, prevy = null; ctx.beginPath(); for (var i = ps; i < points.length; i += ps) { var x1 = points[i - ps], y1 = points[i - ps + 1], x2 = points[i], y2 = points[i + 1]; if (x1 == null || x2 == null) continue; if (y1 <= y2 && y1 < axisy.min) { if (y2 < axisy.min) continue; x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1; y1 = axisy.min } else if (y2 <= y1 && y2 < axisy.min) { if (y1 < axisy.min) continue; x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1; y2 = axisy.min } if (y1 >= y2 && y1 > axisy.max) { if (y2 > axisy.max) continue; x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1; y1 = axisy.max } else if (y2 >= y1 && y2 > axisy.max) { if (y1 > axisy.max) continue; x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1; y2 = axisy.max } if (x1 <= x2 && x1 < axisx.min) { if (x2 < axisx.min) continue; y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1; x1 = axisx.min } else if (x2 <= x1 && x2 < axisx.min) { if (x1 < axisx.min) continue; y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1; x2 = axisx.min } if (x1 >= x2 && x1 > axisx.max) { if (x2 > axisx.max) continue; y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1; x1 = axisx.max } else if (x2 >= x1 && x2 > axisx.max) { if (x1 > axisx.max) continue; y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1; x2 = axisx.max } if (x1 != prevx || y1 != prevy) ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset); prevx = x2; prevy = y2; ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset) } ctx.stroke() } function plotLineArea(datapoints, axisx, axisy) { var points = datapoints.points, ps = datapoints.pointsize, bottom = Math.min(Math.max(0, axisy.min), axisy.max), i = 0, top, areaOpen = false, ypos = 1, segmentStart = 0, segmentEnd = 0; while (true) { if (ps > 0 && i > points.length + ps) break; i += ps; var x1 = points[i - ps], y1 = points[i - ps + ypos], x2 = points[i], y2 = points[i + ypos]; if (areaOpen) { if (ps > 0 && x1 != null && x2 == null) { segmentEnd = i; ps = -ps; ypos = 2; continue } if (ps < 0 && i == segmentStart + ps) { ctx.fill(); areaOpen = false; ps = -ps; ypos = 1; i = segmentStart = segmentEnd + ps; continue } } if (x1 == null || x2 == null) continue; if (x1 <= x2 && x1 < axisx.min) { if (x2 < axisx.min) continue; y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1; x1 = axisx.min } else if (x2 <= x1 && x2 < axisx.min) { if (x1 < axisx.min) continue; y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1; x2 = axisx.min } if (x1 >= x2 && x1 > axisx.max) { if (x2 > axisx.max) continue; y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1; x1 = axisx.max } else if (x2 >= x1 && x2 > axisx.max) { if (x1 > axisx.max) continue; y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1; x2 = axisx.max } if (!areaOpen) { ctx.beginPath(); ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom)); areaOpen = true } if (y1 >= axisy.max && y2 >= axisy.max) { ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max)); ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max)); continue } else if (y1 <= axisy.min && y2 <= axisy.min) { ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min)); ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min)); continue } var x1old = x1, x2old = x2; if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) { x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1; y1 = axisy.min } else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) { x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1; y2 = axisy.min } if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) { x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1; y1 = axisy.max } else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) { x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1; y2 = axisy.max } if (x1 != x1old) { ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1)) } ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1)); ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2)); if (x2 != x2old) { ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2)); ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2)) } } } ctx.save(); ctx.translate(plotOffset.left, plotOffset.top); ctx.lineJoin = "round"; var lw = series.lines.lineWidth, sw = series.shadowSize; if (lw > 0 && sw > 0) { ctx.lineWidth = sw; ctx.strokeStyle = "rgba(0,0,0,0.1)"; var angle = Math.PI / 18; plotLine(series.datapoints, Math.sin(angle) * (lw / 2 + sw / 2), Math.cos(angle) * (lw / 2 + sw / 2), series.xaxis, series.yaxis); ctx.lineWidth = sw / 2; plotLine(series.datapoints, Math.sin(angle) * (lw / 2 + sw / 4), Math.cos(angle) * (lw / 2 + sw / 4), series.xaxis, series.yaxis) } ctx.lineWidth = lw; ctx.strokeStyle = series.color; var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight); if (fillStyle) { ctx.fillStyle = fillStyle; plotLineArea(series.datapoints, series.xaxis, series.yaxis) } if (lw > 0) plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis); ctx.restore() } function drawSeriesPoints(series) { function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) { var points = datapoints.points, ps = datapoints.pointsize; for (var i = 0; i < points.length; i += ps) { var x = points[i], y = points[i + 1]; if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max) continue; ctx.beginPath(); x = axisx.p2c(x); y = axisy.p2c(y) + offset; if (symbol == "circle") ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false); else symbol(ctx, x, y, radius, shadow); ctx.closePath(); if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill() } ctx.stroke() } } ctx.save(); ctx.translate(plotOffset.left, plotOffset.top); var lw = series.points.lineWidth, sw = series.shadowSize, radius = series.points.radius, symbol = series.points.symbol; if (lw == 0) lw = 1e-4; if (lw > 0 && sw > 0) { var w = sw / 2; ctx.lineWidth = w; ctx.strokeStyle = "rgba(0,0,0,0.1)"; plotPoints(series.datapoints, radius, null, w + w / 2, true, series.xaxis, series.yaxis, symbol); ctx.strokeStyle = "rgba(0,0,0,0.2)"; plotPoints(series.datapoints, radius, null, w / 2, true, series.xaxis, series.yaxis, symbol) } ctx.lineWidth = lw; ctx.strokeStyle = series.color; plotPoints(series.datapoints, radius, getFillStyle(series.points, series.color), 0, false, series.xaxis, series.yaxis, symbol); ctx.restore() } function drawBar(x, y, b, barLeft, barRight, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth) { var left, right, bottom, top, drawLeft, drawRight, drawTop, drawBottom, tmp; if (horizontal) { drawBottom = drawRight = drawTop = true; drawLeft = false; left = b; right = x; top = y + barLeft; bottom = y + barRight; if (right < left) { tmp = right; right = left; left = tmp; drawLeft = true; drawRight = false } } else { drawLeft = drawRight = drawTop = true; drawBottom = false; left = x + barLeft; right = x + barRight; bottom = b; top = y; if (top < bottom) { tmp = top; top = bottom; bottom = tmp; drawBottom = true; drawTop = false } } if (right < axisx.min || left > axisx.max || top < axisy.min || bottom > axisy.max) return; if (left < axisx.min) { left = axisx.min; drawLeft = false } if (right > axisx.max) { right = axisx.max; drawRight = false } if (bottom < axisy.min) { bottom = axisy.min; drawBottom = false } if (top > axisy.max) { top = axisy.max; drawTop = false } left = axisx.p2c(left); bottom = axisy.p2c(bottom); right = axisx.p2c(right); top = axisy.p2c(top); if (fillStyleCallback) { c.fillStyle = fillStyleCallback(bottom, top); c.fillRect(left, top, right - left, bottom - top) } if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) { c.beginPath(); c.moveTo(left, bottom); if (drawLeft) c.lineTo(left, top); else c.moveTo(left, top); if (drawTop) c.lineTo(right, top); else c.moveTo(right, top); if (drawRight) c.lineTo(right, bottom); else c.moveTo(right, bottom); if (drawBottom) c.lineTo(left, bottom); else c.moveTo(left, bottom); c.stroke() } } function drawSeriesBars(series) { function plotBars(datapoints, barLeft, barRight, fillStyleCallback, axisx, axisy) { var points = datapoints.points, ps = datapoints.pointsize; for (var i = 0; i < points.length; i += ps) { if (points[i] == null) continue; drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, series.bars.lineWidth) } } ctx.save(); ctx.translate(plotOffset.left, plotOffset.top); ctx.lineWidth = series.bars.lineWidth; ctx.strokeStyle = series.color; var barLeft; switch (series.bars.align) { case "left": barLeft = 0; break; case "right": barLeft = -series.bars.barWidth; break; default: barLeft = -series.bars.barWidth / 2 } var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top) } : null; plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, fillStyleCallback, series.xaxis, series.yaxis); ctx.restore() } function getFillStyle(filloptions, seriesColor, bottom, top) { var fill = filloptions.fill; if (!fill) return null; if (filloptions.fillColor) return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor); var c = $.color.parse(seriesColor); c.a = typeof fill == "number" ? fill : .4; c.normalize(); return c.toString() } function insertLegend() { if (options.legend.container != null) { $(options.legend.container).html("") } else { placeholder.find(".legend").remove() } if (!options.legend.show) { return } var fragments = [], entries = [], rowStarted = false, lf = options.legend.labelFormatter, s, label; for (var i = 0; i < series.length; ++i) { s = series[i]; if (s.label) { label = lf ? lf(s.label, s) : s.label; if (label) { entries.push({ label: label, color: s.color }) } } } if (options.legend.sorted) { if ($.isFunction(options.legend.sorted)) { entries.sort(options.legend.sorted) } else if (options.legend.sorted == "reverse") { entries.reverse() } else { var ascending = options.legend.sorted != "descending"; entries.sort(function (a, b) { return a.label == b.label ? 0 : a.label < b.label != ascending ? 1 : -1 }) } } for (var i = 0; i < entries.length; ++i) { var entry = entries[i]; if (i % options.legend.noColumns == 0) { if (rowStarted) fragments.push("</tr>"); fragments.push("<tr>"); rowStarted = true } fragments.push('<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + entry.color + ';overflow:hidden"></div></div></td>' + '<td class="legendLabel">' + entry.label + "</td>") } if (rowStarted) fragments.push("</tr>"); if (fragments.length == 0) return; var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + "</table>"; if (options.legend.container != null) $(options.legend.container).html(table); else { var pos = "", p = options.legend.position, m = options.legend.margin; if (m[0] == null) m = [m, m]; if (p.charAt(0) == "n") pos += "top:" + (m[1] + plotOffset.top) + "px;"; else if (p.charAt(0) == "s") pos += "bottom:" + (m[1] + plotOffset.bottom) + "px;"; if (p.charAt(1) == "e") pos += "right:" + (m[0] + plotOffset.right) + "px;"; else if (p.charAt(1) == "w") pos += "left:" + (m[0] + plotOffset.left) + "px;"; var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos + ";") + "</div>").appendTo(placeholder); if (options.legend.backgroundOpacity != 0) { var c = options.legend.backgroundColor; if (c == null) { c = options.grid.backgroundColor; if (c && typeof c == "string") c = $.color.parse(c); else c = $.color.extract(legend, "background-color"); c.a = 1; c = c.toString() } var div = legend.children(); $('<div style="position:absolute;width:' + div.width() + "px;height:" + div.height() + "px;" + pos + "background-color:" + c + ';"> </div>').prependTo(legend).css("opacity", options.legend.backgroundOpacity) } } } var highlights = [], redrawTimeout = null; function findNearbyItem(mouseX, mouseY, seriesFilter) { var maxDistance = options.grid.mouseActiveRadius, smallestDistance = maxDistance * maxDistance + 1, item = null, foundPoint = false, i, j, ps; for (i = series.length - 1; i >= 0; --i) { if (!seriesFilter(series[i])) continue; var s = series[i], axisx = s.xaxis, axisy = s.yaxis, points = s.datapoints.points, mx = axisx.c2p(mouseX), my = axisy.c2p(mouseY), maxx = maxDistance / axisx.scale, maxy = maxDistance / axisy.scale; ps = s.datapoints.pointsize; if (axisx.options.inverseTransform) maxx = Number.MAX_VALUE; if (axisy.options.inverseTransform) maxy = Number.MAX_VALUE; if (s.lines.show || s.points.show) { for (j = 0; j < points.length; j += ps) { var x = points[j], y = points[j + 1]; if (x == null) continue; if (x - mx > maxx || x - mx < -maxx || y - my > maxy || y - my < -maxy) continue; var dx = Math.abs(axisx.p2c(x) - mouseX), dy = Math.abs(axisy.p2c(y) - mouseY), dist = dx * dx + dy * dy; if (dist < smallestDistance) { smallestDistance = dist; item = [i, j / ps] } } } if (s.bars.show && !item) { var barLeft, barRight; switch (s.bars.align) { case "left": barLeft = 0; break; case "right": barLeft = -s.bars.barWidth; break; default: barLeft = -s.bars.barWidth / 2 } barRight = barLeft + s.bars.barWidth; for (j = 0; j < points.length; j += ps) { var x = points[j], y = points[j + 1], b = points[j + 2]; if (x == null) continue; if (series[i].bars.horizontal ? mx <= Math.max(b, x) && mx >= Math.min(b, x) && my >= y + barLeft && my <= y + barRight : mx >= x + barLeft && mx <= x + barRight && my >= Math.min(b, y) && my <= Math.max(b, y)) item = [i, j / ps] } } } if (item) { i = item[0]; j = item[1]; ps = series[i].datapoints.pointsize; return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps), dataIndex: j, series: series[i], seriesIndex: i } } return null } function onMouseMove(e) { if (options.grid.hoverable) triggerClickHoverEvent("plothover", e, function (s) { return s["hoverable"] != false }) } function onMouseLeave(e) { if (options.grid.hoverable) triggerClickHoverEvent("plothover", e, function (s) { return false }) } function onClick(e) { triggerClickHoverEvent("plotclick", e, function (s) { return s["clickable"] != false }) } function triggerClickHoverEvent(eventname, event, seriesFilter) { var offset = eventHolder.offset(), canvasX = event.pageX - offset.left - plotOffset.left, canvasY = event.pageY - offset.top - plotOffset.top, pos = canvasToAxisCoords({ left: canvasX, top: canvasY }); pos.pageX = event.pageX; pos.pageY = event.pageY; var item = findNearbyItem(canvasX, canvasY, seriesFilter); if (item) { item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left, 10); item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top, 10) } if (options.grid.autoHighlight) { for (var i = 0; i < highlights.length; ++i) { var h = highlights[i]; if (h.auto == eventname && !(item && h.series == item.series && h.point[0] == item.datapoint[0] && h.point[1] == item.datapoint[1])) unhighlight(h.series, h.point) } if (item) highlight(item.series, item.datapoint, eventname) } placeholder.trigger(eventname, [pos, item]) } function triggerRedrawOverlay() { var t = options.interaction.redrawOverlayInterval; if (t == -1) { drawOverlay(); return } if (!redrawTimeout) redrawTimeout = setTimeout(drawOverlay, t) } function drawOverlay() { redrawTimeout = null; octx.save(); overlay.clear(); octx.translate(plotOffset.left, plotOffset.top); var i, hi; for (i = 0; i < highlights.length; ++i) { hi = highlights[i]; if (hi.series.bars.show) drawBarHighlight(hi.series, hi.point); else drawPointHighlight(hi.series, hi.point) } octx.restore(); executeHooks(hooks.drawOverlay, [octx]) } function highlight(s, point, auto) { if (typeof s == "number") s = series[s]; if (typeof point == "number") { var ps = s.datapoints.pointsize; point = s.datapoints.points.slice(ps * point, ps * (point + 1)) } var i = indexOfHighlight(s, point); if (i == -1) { highlights.push({ series: s, point: point, auto: auto }); triggerRedrawOverlay() } else if (!auto) highlights[i].auto = false } function unhighlight(s, point) { if (s == null && point == null) { highlights = []; triggerRedrawOverlay(); return } if (typeof s == "number") s = series[s]; if (typeof point == "number") { var ps = s.datapoints.pointsize; point = s.datapoints.points.slice(ps * point, ps * (point + 1)) } var i = indexOfHighlight(s, point); if (i != -1) { highlights.splice(i, 1); triggerRedrawOverlay() } } function indexOfHighlight(s, p) { for (var i = 0; i < highlights.length; ++i) { var h = highlights[i]; if (h.series == s && h.point[0] == p[0] && h.point[1] == p[1]) return i } return -1 } function drawPointHighlight(series, point) { var x = point[0], y = point[1], axisx = series.xaxis, axisy = series.yaxis, highlightColor = typeof series.highlightColor === "string" ? series.highlightColor : $.color.parse(series.color).scale("a", .5).toString(); if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max) return; var pointRadius = series.points.radius + series.points.lineWidth / 2; octx.lineWidth = pointRadius; octx.strokeStyle = highlightColor; var radius = 1.5 * pointRadius; x = axisx.p2c(x); y = axisy.p2c(y); octx.beginPath(); if (series.points.symbol == "circle") octx.arc(x, y, radius, 0, 2 * Math.PI, false); else series.points.symbol(octx, x, y, radius, false); octx.closePath(); octx.stroke() } function drawBarHighlight(series, point) { var highlightColor = typeof series.highlightColor === "string" ? series.highlightColor : $.color.parse(series.color).scale("a", .5).toString(), fillStyle = highlightColor, barLeft; switch (series.bars.align) { case "left": barLeft = 0; break; case "right": barLeft = -series.bars.barWidth; break; default: barLeft = -series.bars.barWidth / 2 } octx.lineWidth = series.bars.lineWidth; octx.strokeStyle = highlightColor; drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth, function () { return fillStyle }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth) } function getColorOrGradient(spec, bottom, top, defaultColor) { if (typeof spec == "string") return spec; else { var gradient = ctx.createLinearGradient(0, top, 0, bottom); for (var i = 0, l = spec.colors.length; i < l; ++i) { var c = spec.colors[i]; if (typeof c != "string") { var co = $.color.parse(defaultColor); if (c.brightness != null) co = co.scale("rgb", c.brightness); if (c.opacity != null) co.a *= c.opacity; c = co.toString() } gradient.addColorStop(i / (l - 1), c) } return gradient } }
    } $.plot = function (placeholder, data, options) { var plot = new Plot($(placeholder), data, options, $.plot.plugins); return plot }; $.plot.version = "0.8.2"; $.plot.plugins = []; $.fn.plot = function (data, options) { return this.each(function () { $.plot(this, data, options) }) }; function floorInBase(n, base) { return base * Math.floor(n / base) }
})(jQuery);


// This is bad practice, but I did it anyway for the sake of time.



/* Flot plugin for selecting regions of a plot.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin supports these options:

selection: {
	mode: null or "x" or "y" or "xy",
	color: color,
	shape: "round" or "miter" or "bevel",
	minSize: number of pixels
}

Selection support is enabled by setting the mode to one of "x", "y" or "xy".
In "x" mode, the user will only be able to specify the x range, similarly for
"y" mode. For "xy", the selection becomes a rectangle where both ranges can be
specified. "color" is color of the selection (if you need to change the color
later on, you can get to it with plot.getOptions().selection.color). "shape"
is the shape of the corners of the selection.

"minSize" is the minimum size a selection can be in pixels. This value can
be customized to determine the smallest size a selection can be and still
have the selection rectangle be displayed. When customizing this value, the
fact that it refers to pixels, not axis units must be taken into account.
Thus, for example, if there is a bar graph in time mode with BarWidth set to 1
minute, setting "minSize" to 1 will not make the minimum selection size 1
minute, but rather 1 pixel. Note also that setting "minSize" to 0 will prevent
"plotunselected" events from being fired when the user clicks the mouse without
dragging.

When selection support is enabled, a "plotselected" event will be emitted on
the DOM element you passed into the plot function. The event handler gets a
parameter with the ranges selected on the axes, like this:

	placeholder.bind( "plotselected", function( event, ranges ) {
		alert("You selected " + ranges.xaxis.from + " to " + ranges.xaxis.to)
		// similar for yaxis - with multiple axes, the extra ones are in
		// x2axis, x3axis, ...
	});

The "plotselected" event is only fired when the user has finished making the
selection. A "plotselecting" event is fired during the process with the same
parameters as the "plotselected" event, in case you want to know what's
happening while it's happening,

A "plotunselected" event with no arguments is emitted when the user clicks the
mouse to remove the selection. As stated above, setting "minSize" to 0 will
destroy this behavior.

The plugin allso adds the following methods to the plot object:

- setSelection( ranges, preventEvent )

  Set the selection rectangle. The passed in ranges is on the same form as
  returned in the "plotselected" event. If the selection mode is "x", you
  should put in either an xaxis range, if the mode is "y" you need to put in
  an yaxis range and both xaxis and yaxis if the selection mode is "xy", like
  this:

	setSelection({ xaxis: { from: 0, to: 10 }, yaxis: { from: 40, to: 60 } });

  setSelection will trigger the "plotselected" event when called. If you don't
  want that to happen, e.g. if you're inside a "plotselected" handler, pass
  true as the second parameter. If you are using multiple axes, you can
  specify the ranges on any of those, e.g. as x2axis/x3axis/... instead of
  xaxis, the plugin picks the first one it sees.

- clearSelection( preventEvent )

  Clear the selection rectangle. Pass in true to avoid getting a
  "plotunselected" event.

- getSelection()

  Returns the current selection in the same format as the "plotselected"
  event. If there's currently no selection, the function returns null.

*/

(function ($) {
    function init(plot) {
        var selection = {
            first: { x: -1, y: -1 }, second: { x: -1, y: -1 },
            show: false,
            active: false
        };

        // FIXME: The drag handling implemented here should be
        // abstracted out, there's some similar code from a library in
        // the navigation plugin, this should be massaged a bit to fit
        // the Flot cases here better and reused. Doing this would
        // make this plugin much slimmer.
        var savedhandlers = {};

        var mouseUpHandler = null;

        function onMouseMove(e) {
            if (selection.active) {
                updateSelection(e);

                plot.getPlaceholder().trigger("plotselecting", [getSelection()]);
            }
        }

        function onMouseDown(e) {
            if (e.which != 1)  // only accept left-click
                return;

            // cancel out any text selections
            document.body.focus();

            // prevent text selection and drag in old-school browsers
            if (document.onselectstart !== undefined && savedhandlers.onselectstart == null) {
                savedhandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () { return false; };
            }
            if (document.ondrag !== undefined && savedhandlers.ondrag == null) {
                savedhandlers.ondrag = document.ondrag;
                document.ondrag = function () { return false; };
            }

            setSelectionPos(selection.first, e);

            selection.active = true;

            // this is a bit silly, but we have to use a closure to be
            // able to whack the same handler again
            mouseUpHandler = function (e) { onMouseUp(e); };

            $(document).one("mouseup", mouseUpHandler);
        }

        function onMouseUp(e) {
            mouseUpHandler = null;

            // revert drag stuff for old-school browsers
            if (document.onselectstart !== undefined)
                document.onselectstart = savedhandlers.onselectstart;
            if (document.ondrag !== undefined)
                document.ondrag = savedhandlers.ondrag;

            // no more dragging
            selection.active = false;
            updateSelection(e);

            if (selectionIsSane())
                triggerSelectedEvent();
            else {
                // this counts as a clear
                plot.getPlaceholder().trigger("plotunselected", []);
                plot.getPlaceholder().trigger("plotselecting", [null]);
            }

            return false;
        }

        function getSelection() {
            if (!selectionIsSane())
                return null;

            if (!selection.show) return null;

            var r = {}, c1 = selection.first, c2 = selection.second;
            $.each(plot.getAxes(), function (name, axis) {
                if (axis.used) {
                    var p1 = axis.c2p(c1[axis.direction]), p2 = axis.c2p(c2[axis.direction]);
                    r[name] = { from: Math.min(p1, p2), to: Math.max(p1, p2) };
                }
            });
            return r;
        }

        function triggerSelectedEvent() {
            var r = getSelection();

            plot.getPlaceholder().trigger("plotselected", [r]);

            // backwards-compat stuff, to be removed in future
            if (r.xaxis && r.yaxis)
                plot.getPlaceholder().trigger("selected", [{ x1: r.xaxis.from, y1: r.yaxis.from, x2: r.xaxis.to, y2: r.yaxis.to }]);
        }

        function clamp(min, value, max) {
            return value < min ? min : (value > max ? max : value);
        }

        function setSelectionPos(pos, e) {
            var o = plot.getOptions();
            var offset = plot.getPlaceholder().offset();
            var plotOffset = plot.getPlotOffset();
            pos.x = clamp(0, e.pageX - offset.left - plotOffset.left, plot.width());
            pos.y = clamp(0, e.pageY - offset.top - plotOffset.top, plot.height());

            if (o.selection.mode == "y")
                pos.x = pos == selection.first ? 0 : plot.width();

            if (o.selection.mode == "x")
                pos.y = pos == selection.first ? 0 : plot.height();
        }

        function updateSelection(pos) {
            if (pos.pageX == null)
                return;

            setSelectionPos(selection.second, pos);
            if (selectionIsSane()) {
                selection.show = true;
                plot.triggerRedrawOverlay();
            }
            else
                clearSelection(true);
        }

        function clearSelection(preventEvent) {
            if (selection.show) {
                selection.show = false;
                plot.triggerRedrawOverlay();
                if (!preventEvent)
                    plot.getPlaceholder().trigger("plotunselected", []);
            }
        }

        // function taken from markings support in Flot
        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = plot.getAxes();

            for (var k in axes) {
                axis = axes[k];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? plot.getXAxes()[0] : plot.getYAxes()[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function setSelection(ranges, preventEvent) {
            var axis, range, o = plot.getOptions();

            if (o.selection.mode == "y") {
                selection.first.x = 0;
                selection.second.x = plot.width();
            }
            else {
                range = extractRange(ranges, "x");

                selection.first.x = range.axis.p2c(range.from);
                selection.second.x = range.axis.p2c(range.to);
            }

            if (o.selection.mode == "x") {
                selection.first.y = 0;
                selection.second.y = plot.height();
            }
            else {
                range = extractRange(ranges, "y");

                selection.first.y = range.axis.p2c(range.from);
                selection.second.y = range.axis.p2c(range.to);
            }

            selection.show = true;
            plot.triggerRedrawOverlay();
            if (!preventEvent && selectionIsSane())
                triggerSelectedEvent();
        }

        function selectionIsSane() {
            var minSize = plot.getOptions().selection.minSize;
            return Math.abs(selection.second.x - selection.first.x) >= minSize &&
                Math.abs(selection.second.y - selection.first.y) >= minSize;
        }

        plot.clearSelection = clearSelection;
        plot.setSelection = setSelection;
        plot.getSelection = getSelection;

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            var o = plot.getOptions();
            if (o.selection.mode != null) {
                eventHolder.mousemove(onMouseMove);
                eventHolder.mousedown(onMouseDown);
            }
        });


        plot.hooks.drawOverlay.push(function (plot, ctx) {
            // draw selection
            if (selection.show && selectionIsSane()) {
                var plotOffset = plot.getPlotOffset();
                var o = plot.getOptions();

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                var c = $.color.parse(o.selection.color);

                ctx.strokeStyle = c.scale('a', 0.8).toString();
                ctx.lineWidth = 1;
                ctx.lineJoin = o.selection.shape;
                ctx.fillStyle = c.scale('a', 0.4).toString();

                var x = Math.min(selection.first.x, selection.second.x) + 0.5,
                    y = Math.min(selection.first.y, selection.second.y) + 0.5,
                    w = Math.abs(selection.second.x - selection.first.x) - 1,
                    h = Math.abs(selection.second.y - selection.first.y) - 1;

                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);

                ctx.restore();
            }
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mousedown", onMouseDown);

            if (mouseUpHandler)
                $(document).unbind("mouseup", mouseUpHandler);
        });

    }

    $.plot.plugins.push({
        init: init,
        options: {
            selection: {
                mode: null, // one of null, "x", "y" or "xy"
                color: "#e8cfac",
                shape: "round", // one of "round", "miter", or "bevel"
                minSize: 5 // minimum number of pixels
            }
        },
        name: 'selection',
        version: '1.1'
    });
})(jQuery);


// Another bad idea, but for the time, and mike

/* Pretty handling of time axes.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

Set axis.mode to "time" to enable. See the section "Time series data" in
API.txt for details.

*/

(function ($) {

    var options = {
        xaxis: {
            timezone: null,		// "browser" for local to the client or timezone for timezone-js
            timeformat: null,	// format string to use
            twelveHourClock: false,	// 12 or 24 time in time mode
            monthNames: null	// list of names of months
        }
    };

    // round to nearby lower multiple of base

    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

    // Returns a string with the date d formatted according to fmt.
    // A subset of the Open Group's strftime format is supported.

    function formatDate(d, fmt, monthNames, dayNames) {

        if (typeof d.strftime == "function") {
            return d.strftime(fmt);
        }

        var leftPad = function (n, pad) {
            n = "" + n;
            pad = "" + (pad == null ? "0" : pad);
            return n.length == 1 ? pad + n : n;
        };

        var r = [];
        var escape = false;
        var hours = d.getHours();
        var isAM = hours < 12;

        if (monthNames == null) {
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }

        if (dayNames == null) {
            dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        }

        var hours12;

        if (hours > 12) {
            hours12 = hours - 12;
        } else if (hours == 0) {
            hours12 = 12;
        } else {
            hours12 = hours;
        }

        for (var i = 0; i < fmt.length; ++i) {

            var c = fmt.charAt(i);

            if (escape) {
                switch (c) {
                    case 'a': c = "" + dayNames[d.getDay()]; break;
                    case 'b': c = "" + monthNames[d.getMonth()]; break;
                    case 'd': c = leftPad(d.getDate()); break;
                    case 'e': c = leftPad(d.getDate(), " "); break;
                    case 'h':	// For back-compat with 0.7; remove in 1.0
                    case 'H': c = leftPad(hours); break;
                    case 'I': c = leftPad(hours12); break;
                    case 'l': c = leftPad(hours12, " "); break;
                    case 'm': c = leftPad(d.getMonth() + 1); break;
                    case 'M': c = leftPad(d.getMinutes()); break;
                        // quarters not in Open Group's strftime specification
                    case 'q':
                        c = "" + (Math.floor(d.getMonth() / 3) + 1); break;
                    case 'S': c = leftPad(d.getSeconds()); break;
                    case 'y': c = leftPad(d.getFullYear() % 100); break;
                    case 'Y': c = "" + d.getFullYear(); break;
                    case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
                    case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
                    case 'w': c = "" + d.getDay(); break;
                }
                r.push(c);
                escape = false;
            } else {
                if (c == "%") {
                    escape = true;
                } else {
                    r.push(c);
                }
            }
        }

        return r.join("");
    }

    // To have a consistent view of time-based data independent of which time
    // zone the client happens to be in we need a date-like object independent
    // of time zones.  This is done through a wrapper that only calls the UTC
    // versions of the accessor methods.

    function makeUtcWrapper(d) {

        function addProxyMethod(sourceObj, sourceMethod, targetObj, targetMethod) {
            sourceObj[sourceMethod] = function () {
                return targetObj[targetMethod].apply(targetObj, arguments);
            };
        };

        var utc = {
            date: d
        };

        // support strftime, if found

        if (d.strftime != undefined) {
            addProxyMethod(utc, "strftime", d, "strftime");
        }

        addProxyMethod(utc, "getTime", d, "getTime");
        addProxyMethod(utc, "setTime", d, "setTime");

        var props = ["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds"];

        for (var p = 0; p < props.length; p++) {
            addProxyMethod(utc, "get" + props[p], d, "getUTC" + props[p]);
            addProxyMethod(utc, "set" + props[p], d, "setUTC" + props[p]);
        }

        return utc;
    };

    // select time zone strategy.  This returns a date-like object tied to the
    // desired timezone

    function dateGenerator(ts, opts) {
        if (opts.timezone == "browser") {
            return new Date(ts);
        } else if (!opts.timezone || opts.timezone == "utc") {
            return makeUtcWrapper(new Date(ts));
        } else if (typeof timezoneJS != "undefined" && typeof timezoneJS.Date != "undefined") {
            var d = new timezoneJS.Date();
            // timezone-js is fickle, so be sure to set the time zone before
            // setting the time.
            d.setTimezone(opts.timezone);
            d.setTime(ts);
            return d;
        } else {
            return makeUtcWrapper(new Date(ts));
        }
    }

    // map of app. size of time units in milliseconds

    var timeUnitSize = {
        "second": 1000,
        "minute": 60 * 1000,
        "hour": 60 * 60 * 1000,
        "day": 24 * 60 * 60 * 1000,
        "month": 30 * 24 * 60 * 60 * 1000,
        "quarter": 3 * 30 * 24 * 60 * 60 * 1000,
        "year": 365.2425 * 24 * 60 * 60 * 1000
    };

    // the allowed tick sizes, after 1 year we use
    // an integer algorithm

    var baseSpec = [
		[1, "second"], [2, "second"], [5, "second"], [10, "second"],
		[30, "second"],
		[1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],
		[30, "minute"],
		[1, "hour"], [2, "hour"], [4, "hour"],
		[8, "hour"], [12, "hour"],
		[1, "day"], [2, "day"], [3, "day"],
		[0.25, "month"], [0.5, "month"], [1, "month"],
		[2, "month"]
    ];

    // we don't know which variant(s) we'll need yet, but generating both is
    // cheap

    var specMonths = baseSpec.concat([[3, "month"], [6, "month"],
		[1, "year"]]);
    var specQuarters = baseSpec.concat([[1, "quarter"], [2, "quarter"],
		[1, "year"]]);

    function init(plot) {
        plot.hooks.processOptions.push(function (plot, options) {
            $.each(plot.getAxes(), function (axisName, axis) {

                var opts = axis.options;

                if (opts.mode == "time") {
                    axis.tickGenerator = function (axis) {

                        var ticks = [];
                        var d = dateGenerator(axis.min, opts);
                        var minSize = 0;

                        // make quarter use a possibility if quarters are
                        // mentioned in either of these options

                        var spec = (opts.tickSize && opts.tickSize[1] ===
							"quarter") ||
							(opts.minTickSize && opts.minTickSize[1] ===
							"quarter") ? specQuarters : specMonths;

                        if (opts.minTickSize != null) {
                            if (typeof opts.tickSize == "number") {
                                minSize = opts.tickSize;
                            } else {
                                minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
                            }
                        }

                        for (var i = 0; i < spec.length - 1; ++i) {
                            if (axis.delta < (spec[i][0] * timeUnitSize[spec[i][1]]
											  + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
								&& spec[i][0] * timeUnitSize[spec[i][1]] >= minSize) {
                                break;
                            }
                        }

                        var size = spec[i][0];
                        var unit = spec[i][1];

                        // special-case the possibility of several years

                        if (unit == "year") {

                            // if given a minTickSize in years, just use it,
                            // ensuring that it's an integer

                            if (opts.minTickSize != null && opts.minTickSize[1] == "year") {
                                size = Math.floor(opts.minTickSize[0]);
                            } else {

                                var magn = Math.pow(10, Math.floor(Math.log(axis.delta / timeUnitSize.year) / Math.LN10));
                                var norm = (axis.delta / timeUnitSize.year) / magn;

                                if (norm < 1.5) {
                                    size = 1;
                                } else if (norm < 3) {
                                    size = 2;
                                } else if (norm < 7.5) {
                                    size = 5;
                                } else {
                                    size = 10;
                                }

                                size *= magn;
                            }

                            // minimum size for years is 1

                            if (size < 1) {
                                size = 1;
                            }
                        }

                        axis.tickSize = opts.tickSize || [size, unit];
                        var tickSize = axis.tickSize[0];
                        unit = axis.tickSize[1];

                        var step = tickSize * timeUnitSize[unit];

                        if (unit == "second") {
                            d.setSeconds(floorInBase(d.getSeconds(), tickSize));
                        } else if (unit == "minute") {
                            d.setMinutes(floorInBase(d.getMinutes(), tickSize));
                        } else if (unit == "hour") {
                            d.setHours(floorInBase(d.getHours(), tickSize));
                        } else if (unit == "month") {
                            d.setMonth(floorInBase(d.getMonth(), tickSize));
                        } else if (unit == "quarter") {
                            d.setMonth(3 * floorInBase(d.getMonth() / 3,
								tickSize));
                        } else if (unit == "year") {
                            d.setFullYear(floorInBase(d.getFullYear(), tickSize));
                        }

                        // reset smaller components

                        d.setMilliseconds(0);

                        if (step >= timeUnitSize.minute) {
                            d.setSeconds(0);
                        }
                        if (step >= timeUnitSize.hour) {
                            d.setMinutes(0);
                        }
                        if (step >= timeUnitSize.day) {
                            d.setHours(0);
                        }
                        if (step >= timeUnitSize.day * 4) {
                            d.setDate(1);
                        }
                        if (step >= timeUnitSize.month * 2) {
                            d.setMonth(floorInBase(d.getMonth(), 3));
                        }
                        if (step >= timeUnitSize.quarter * 2) {
                            d.setMonth(floorInBase(d.getMonth(), 6));
                        }
                        if (step >= timeUnitSize.year) {
                            d.setMonth(0);
                        }

                        var carry = 0;
                        var v = Number.NaN;
                        var prev;

                        do {

                            prev = v;
                            v = d.getTime();
                            ticks.push(v);

                            if (unit == "month" || unit == "quarter") {
                                if (tickSize < 1) {

                                    // a bit complicated - we'll divide the
                                    // month/quarter up but we need to take
                                    // care of fractions so we don't end up in
                                    // the middle of a day

                                    d.setDate(1);
                                    var start = d.getTime();
                                    d.setMonth(d.getMonth() +
										(unit == "quarter" ? 3 : 1));
                                    var end = d.getTime();
                                    d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
                                    carry = d.getHours();
                                    d.setHours(0);
                                } else {
                                    d.setMonth(d.getMonth() +
										tickSize * (unit == "quarter" ? 3 : 1));
                                }
                            } else if (unit == "year") {
                                d.setFullYear(d.getFullYear() + tickSize);
                            } else {
                                d.setTime(v + step);
                            }
                        } while (v < axis.max && v != prev);

                        return ticks;
                    };

                    axis.tickFormatter = function (v, axis) {

                        var d = dateGenerator(v, axis.options);

                        // first check global format

                        if (opts.timeformat != null) {
                            return formatDate(d, opts.timeformat, opts.monthNames, opts.dayNames);
                        }

                        // possibly use quarters if quarters are mentioned in
                        // any of these places

                        var useQuarters = (axis.options.tickSize &&
								axis.options.tickSize[1] == "quarter") ||
							(axis.options.minTickSize &&
								axis.options.minTickSize[1] == "quarter");

                        var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
                        var span = axis.max - axis.min;
                        var suffix = (opts.twelveHourClock) ? " %p" : "";
                        var hourCode = (opts.twelveHourClock) ? "%I" : "%H";
                        var fmt;

                        if (t < timeUnitSize.minute) {
                            fmt = hourCode + ":%M:%S" + suffix;
                        } else if (t < timeUnitSize.day) {
                            if (span < 2 * timeUnitSize.day) {
                                fmt = hourCode + ":%M" + suffix;
                            } else {
                                fmt = "%b %d " + hourCode + ":%M" + suffix;
                            }
                        } else if (t < timeUnitSize.month) {
                            fmt = "%b %d";
                        } else if ((useQuarters && t < timeUnitSize.quarter) ||
							(!useQuarters && t < timeUnitSize.year)) {
                            if (span < timeUnitSize.year) {
                                fmt = "%b";
                            } else {
                                fmt = "%b %Y";
                            }
                        } else if (useQuarters && t < timeUnitSize.year) {
                            if (span < timeUnitSize.year) {
                                fmt = "Q%q";
                            } else {
                                fmt = "Q%q %Y";
                            }
                        } else {
                            fmt = "%Y";
                        }

                        var rt = formatDate(d, fmt, opts.monthNames, opts.dayNames);

                        return rt;
                    };
                }
            });
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'time',
        version: '1.0'
    });

    // Time-axis support used to be in Flot core, which exposed the
    // formatDate function on the plot object.  Various plugins depend
    // on the function, so we need to re-expose it here.

    $.plot.formatDate = formatDate;

})(jQuery);
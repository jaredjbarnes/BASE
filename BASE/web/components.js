BASE.require([
    "jQuery",
    "Array.prototype.forEach",
    "Element.prototype.replaceWith",
    "String.prototype.trim",
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.async.Continuation",
    "JSON",
    "BASE.util.Guid",
    "jQuery.fn.on"
], function () {

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Continuation = BASE.async.Continuation;
    var Guid = BASE.util.Guid;

    BASE.namespace("BASE.web.components");

    var style = document.createElement('style');
    var $componentStyles = $(style).data("components", {});
    style.setAttribute("type", "text/css");
    $("head").prepend(style);

    var getConfig = function (url) {
        return new BASE.async.Future(function (setValue, setError) {
            if (url) {
                jQuery.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function (obj) {
                        setValue(obj);
                    },
                    error: function () {
                        setError(new Error("Error while trying to retrieve url: " + url));
                    }
                });
            } else {
                setValue({
                    aliases: {}
                });
            }
        });
    };

    var getConfigInElement = function (elem) {
        var configs = $(elem).find("script[type='components/config']");
        var task = new BASE.async.Task();

        // This will run once to get the global config, so we don't want to include it on the first go around.
        if (typeof globalConfigFuture !== "undefined") {
            task.add(globalConfigFuture);
        }

        configs.each(function () {
            var $config = $(this);
            var url = $config.attr("src");
            if (!url) {
                try {
                    var configObj = JSON.parse($config.html())
                    task.add(Future.fromResult(configObj));
                } catch (e) {
                    task.add(Future.fromError(e));
                }
            } else {
                task.add(getConfig(url));
            }
        });

        return new Future(function (setValue, setError) {
            task.start().whenAll(function (futures) {
                var concatConfig = { aliases: {} };
                var error = null;

                futures.forEach(function (future) {
                    if (future.error === null) {
                        var config = future.value;
                        Object.keys(config.aliases).forEach(function (key) {
                            concatConfig.aliases[key] = config.aliases[key];
                        });
                    } else {
                        error = future.error;
                    }
                });

                if (error) {
                    setError(error);
                } else {
                    setValue(concatConfig);
                }

            });
        });
    };

    var globalConfigFuture = getConfigInElement($("head")[0]);

    var HtmlCache = function () {
        var self = this;
        var cache = {};

        var ifError = function (e) {
            throw e;
        };

        self.getComponentHtml = function (url) {
            if (cache[url]) {
                return cache[url];
            } else {
                return cache[url] = new Future(function (setValue, setError) {
                    jQuery.ajax({
                        url: url,
                        type: "GET",
                        dataType: "html",
                        success: function (html) {
                            setValue(html);
                        },
                        error: function () {
                            setError(new Error("Error while trying to retrieve url: " + url));
                        }

                    });
                }).ifError(ifError);
            }
        };
    };

    var hasImport = function (text) {
        return text.indexOf("@import") >= 0;
    };

    // TODO: Blake had a good idea to move all the @ directives into one style sheet.
    // This would save us from hitting the threshold in IE with their stylesheet limit.
    var appendStyle = function (text) {
        var style = $componentStyles[0];
        var css;
        var textnode;

        if (style.styleSheet) {   // Old IE
            css = style.styleSheet.cssText || "";
            css += text;
            style.styleSheet.cssText = css;
        } else {// the world
            textNode = document.createTextNode(text);
            style.appendChild(textNode);
        }
    };

    var importRegEx = /@import url\(\"?(.*?)\"?\)\;/gi;

    var stripOutImports = function (text, onEach) {
        onEach = onEach || function () { };
        var match = importRegEx.exec(text);

        while (match !== null) {
            onEach(match[1]);
            match = importRegEx.exec(text);
        }

        var newText = text.replace(importRegEx, "");

        return text;
    };

    var createLinks = function (text) {
        return stripOutImports(text, function (url) {
            if (document.createStyleSheet) {
                document.createStyleSheet(url);
            }
            else {
                $componentStyles.before("<link rel=\"stylesheet\" href=\"" + url + "\" />");
            }
        });
    };

    var handleStyles = function (url, $element) {
        $element.find("style").remove().each(function (index) {
            var $this = $(this);
            var style = $componentStyles[0];
            var exist;
            var components = $componentStyles.data("components");
            var text;

            exist = components[url + index];
            if (!exist) {
                components[url + index] = url;

                if (style.styleSheet) {
                    text = this.styleSheet.cssText;
                } else {// the world
                    text = $this.text();
                }

                text = createLinks(text);
                appendStyle(text);

            }
        });
    };

    var ComponentCache = function () {
        var self = this;
        var cache = {};
        var htmlCache = new HtmlCache();

        self.getComponentTemplate = function (url) {
            var future;
            if (cache[url]) {
                future = cache[url];
            } else {
                future = cache[url] = new Future(function (setValue, setError) {
                    htmlCache.getComponentHtml(url).then(function (html) {
                        var $element = $(html);
                        var element = $element[0];
                        getConfigInElement(element).then(function (config) {
                            var aliases = config.aliases;

                            var task = new Task();
                            var guid = Guid.create();

                            $element.attr("cid", guid);

                            $element.find("[tag]").each(function () {
                                var $this = $(this);
                                var tagName = $this.attr("tag");
                                $this.attr("owner", guid);
                            });

                            handleStyles(url, $element);

                            $element.children().each(function () {
                                var oldElement = this;

                                task.add(loadComponentsDeep(oldElement).then(function (newElement) {
                                    $(oldElement).replaceWith(newElement);
                                }));
                            });

                            task.start().whenAll(function (futures) {
                                setValue(element);
                            });

                        });
                    });
                });
            }

            return future;
        };

        self.loadComponent = function (url, $withContent) {
            return new Future(function (setValue, setError) {
                self.getComponentTemplate(url).then(function (template) {
                    var element = $(template).clone()[0];// template.cloneNode(true);
                    var $element = $(element);

                    var $tempHolder = $(document.createElement("div"));

                    // Fills the content tags with matching criteria.
                    $element.find("embed").each(function () {
                        var $contentTag = $(this);
                        var selector = $contentTag.attr("select");
                        if (selector) {
                            // For some reason selectors don't work on document fragments.
                            // So we wrap it and do a search.

                            $withContent.appendTo($tempHolder);

                            $tempHolder.children(selector).each(function () {
                                $(this).remove().insertBefore($contentTag);
                            });

                            $withContent = $tempHolder.contents();
                        } else {
                            $withContent.insertBefore($contentTag);
                        }

                        $contentTag.remove();
                    });

                    setValue(element);
                });
            });

        };
    };

    var componentCache = new ComponentCache();
    var disallowedDiggers = "iframe, object, embed, [template]";

    var walkTheDomAsync = function (element, asyncOperation, scope) {
        scope = scope || {};
        return new Future(function (setValue, setError) {
            var task = new Task();
            if (!$(element).is(disallowedDiggers)) {
                $(element).children().each(function () {
                    var Scope = function () { };
                    Scope.prototype = scope;
                    task.add(walkTheDomAsync(this, asyncOperation, new Scope()));
                });
            }
            task.start().whenAll(function (childrenFutures) {
                asyncOperation(element, scope).then(setValue).ifError(setError);
            });
        });
    };

    var buildDomAsync = function (element, asyncOperation) {
        return new Future(function (setValue, setError) {
            var task = new Task();

            if (!$(element).is(disallowedDiggers)) {
                $(element).contents().each(function () {
                    var childElement = this;
                    task.add(buildDomAsync(childElement, asyncOperation));
                });
            }
            task.start().whenAll(function (childrenFutures) {
                asyncOperation(element).then(function (lastElement) {

                    if (lastElement !== element) {
                        $(element).replaceWith(lastElement);
                        setValue(lastElement);
                    } else {
                        setValue(element);
                    }

                }).ifError(setError);
            });
        });
    };

    var loadControllers = function (startElement) {

        return walkTheDomAsync(startElement, function (element, scope) {
            return new Future(function (setValue, setError) {
                var $element = $(element);

                var controllerName = $element.attr("controller");
                var controllerFuture = BASE.async.Future.fromResult(null);

                // Instantiate the controller if applicable
                if (controllerName && !$element.data("controller")) {
                    $element.data("controller", "loading...");

                    var controllerFuture = new BASE.async.Future(function (setValue, setError) {
                        BASE.require([controllerName], function () {
                            var Controller = BASE.getObject(controllerName);
                            var tags = {};
                            var $component = $element.closest("[component]");
                            var guid = $component.attr("cid");

                            $component.find("[owner='" + guid + "']").each(function () {
                                var $this = $(this);
                                if ($this.closest("[cid='" + guid + "']")[0] === $component[0]) {
                                    tags[$this.attr("tag")] = this;
                                }
                            });


                            var instance = new Controller(element, tags, scope);
                            $element.data("controller", instance);
                            $element.data("scope", scope);

                            setValue(instance);
                        });
                    });
                }

                // When the controller is set up, apply behaviors if applicable
                var cont = new Continuation(controllerFuture).then(function (controller) {
                    controller = controller || {};
                    var applyList = $element.attr("apply");
                    if (applyList) {
                        var behaviors = applyList.split(";").map(function (b) { return b.trim(); });
                        BASE.require(behaviors, function () {
                            behaviors.forEach(function (b) {
                                var Behavior = BASE.getObject(b);
                                Behavior.call(controller, element);
                            });
                            setValue();
                        });
                    } else {
                        setValue();
                    }
                    return Future.fromResult(null);
                });


            });
        }, {});
    };

    var loadComponentsDeep = function (startElement) {
        var startElementClone = $(startElement).clone()[0];
        return new Future(function (setValue, setError) {
            buildDomAsync(startElementClone, function (element) {
                return new Future(function (setValue, setError) {
                    var $element = $(element);

                    var componentName = $element.attr("component");

                    // Make sure the component isn't loaded twice.
                    if (componentName && !$element.data("componentLoaded")) {
                        // We need to check the global aliases for a match.
                        globalConfigFuture.then(function (config) {
                            var aliases = config.aliases;
                            componentName = aliases[componentName] || componentName;

                            componentCache.loadComponent(componentName, $element.contents().remove()).then(function (clone) {
                                var domAttribute;
                                // Apply attributes that were on the previous element.
                                for (var x = 0 ; x < element.attributes.length; x++) {
                                    domAttribute = element.attributes.item(x);
                                    $(clone).attr(domAttribute.nodeName, domAttribute.nodeValue);
                                }

                                // Set the component as loaded.
                                $(clone).data("componentLoaded", true);

                                setValue(clone);
                            });
                        });
                    } else {
                        setValue(element);
                    }
                });

            }).then(setValue);
        }).then();
    };

    var loadComponents = function (startElement) {
        $(startElement).find("script").remove();
        return new Future(function (setValue, setError) {

            loadComponentsDeep(startElement).then(function (lastElement) {
                $(startElement).replaceWith(lastElement);
                loadControllers(lastElement).then(function () {
                    setValue(lastElement);
                });
            });

        });
    };

    BASE.web.components.load = function (element) {
        if ($(element).closest("body").length === 0) {
            throw new Error("Loading components relies on the element be part of the document.");
        }

        return loadComponents.apply(null, arguments);
    };


    BASE.web.components.createComponent = function (url, content, attributes) {
        var div = document.createElement("div");
        $(div).attr(attributes || {}).attr("component", url);
        if (typeof content !== "undefined") {
            $(div).append($(content));
        }
        return loadComponents(div);
    };

    BASE.web.components.replaceElementWith = function (element, url) {
        $(element).attr("component", url);
        return BASE.web.components.load(element).then(function (lastElement) {

            $(lastElement).find("[component]").each(function () {
                $(this).triggerHandler({
                    type: "enteredView"
                });
            });

        });
    };

    BASE.web.components.getComponentCache = function () {
        return componentCache;
    };

    document.createComponent = BASE.web.components.createComponent;

    Element.prototype.replaceWithComponent = function (url) {
        return BASE.web.components.replaceElementWith(this, url);
    };

    $(function () {
        var task = new Task();

        $("[component], [controller], [apply]").each(function () {
            task.add(loadComponents(this).then(function (lastElement) {
                $(lastElement).find("[component]").each(function () {
                    $(this).triggerHandler({
                        type: "enteredView"
                    });
                });
                $(lastElement).triggerHandler({
                    type: "enteredView"
                });
            }));
        });

        task.start().whenAll(function () {
            $(document).trigger({
                type: "componentsReady"
            });
        });

    });

    jQuery.prototype.controller = function () {
        return $(this[0]).data("controller");
    };

});
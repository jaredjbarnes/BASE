/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/Object/create.js" />
/// <reference path="/scripts/jQuery/fn/region.js" />
/// <reference path="/scripts/BASE/EventEmitter.js" />
/// <reference path="/scripts/jQuery/loadFile.js" />
/// <reference path="/scripts/WEB/ui/View.js" />

BASE.require(["jQuery", "jQuery.fn.region", "Object.create", "BASE.EventEmitter", "jQuery.loadFile", "WEB.ui.View"], function () {

    var isElement = function (obj) {
        try {
            return obj instanceof HTMLElement;
        }
        catch (e) {
            return (typeof obj === "object") &&
      (obj.nodeType === 1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument === "object");
        }
    };

    var loadView = function (view, oldValue, callback) {
        callback = callback || function () { };
        var emit = function () {
            var event = new BASE.Event("viewChanged");
            event.oldValue = oldValue;
            event.newValue = view;

            self.emit(event);
        };

        var self = this;
        $view = $(view);
        $view.data("WEB.ui.ViewController", self);
        viewUrl = $view.attr("data-controlUrl");
        viewScript = $view.attr("data-script") || "WEB.ui.ViewController";

        if (!viewScript || !viewUrl) {
            throw new Error("View needs to have an attr of data-controlUrl.");
        }

        BASE.require([viewScript], function () {
            var UIViewController = BASE.getObject(viewScript);
            var uiViewController = typeof UIViewController === "function" ? new UIViewController(view) : new WEB.ui.ViewController(view);
            if (uiViewController instanceof WEB.ui.ViewController) {
                self.viewDidLoad(oldValue, view);
                callback();
                emit();
            } else {
                throw new Error(viewScript + " was not an instance of WEB.ui.ViewController");
            }
        });
    };

    var loadAllViewControllers = function () { };

    BASE.namespace("WEB.ui");

    WEB.ui.ViewController = function (domElement) {
        var self = this;
        //Calling super.
        BASE.EventEmitter.call(self);

        var view = null;
        var viewUrl = null;
        var viewCallbackId = null;
        var viewCode = null;
        var isViewLoaded = false;
        var isInitialized = false;

        Object.defineProperties(self, {
            view: {
                get: function () {
                    return view;
                },
                set: function (value) {
                    var oldValue = view;
                    isInitialized = true;
                    
                    var fnCallback = function(view){
                        loadView.apply(self, [view, oldValue, function () {
                            isViewLoaded = true;
                        } ]);
                        
                        WEB.ui.ViewController.initializeFromRoot(view);
                        WEB.ui.View.initializeFromRoot(view);
                    };
                    
                    if (typeof value === "string") {
                        var id = viewCallbackId = Math.random();
                        viewUrl = value;
                        jQuery.loadFile(value, {
                            fromCache: true,
                            success: function (html) {
                                if (id === viewCallbackId) {
                                    view = $(html)[0];
                                    fnCallback(view);
                                }
                            },
                            error: function () {
                                throw new Error("Failed to load the view from url.");
                            }
                        }, function () { });
                    } else if (isElement(value)) {
                        view = value;
                        fnCallback(value);
                    } else {
                        throw new Error("The view can only be set as a DOMElement or a url where the element exist.");
                    }
                }
            },
            isViewLoaded: {
                get: function () {
                    return isViewLoaded;
                }
            },
            loadView: {
                value: function (callback) {
                    if (view == null && viewUrl) {
                        callback = callback || function () { };
                        var wCallback = function () {
                            callback();
                            self.removeListener("viewChanged", wCallback);
                        };

                        self.on("viewChanged", wCallback);
                        self.view = viewUrl;
                    }
                },
                writable: false
            },
            unloadView: {
                value: function () {
                    view = null;
                    self.viewDidUnload();
                },
                writable: false
            },
            isInitialized: {
                get: function () {
                    return isInitialized;
                }
            }
        });

        self.viewDidLoad = function () { };
        self.viewDidUnload = function () { };
        self.viewWillAppear = function () { };
    };

    WEB.ui.ViewController.prototype = new BASE.EventEmitter();
    WEB.ui.ViewController.initializeFromRoot = function( root ){
        var findFirstParent = function($elem, condition, callback){
            callback = callback || function(){};
            condition = condition || function(){};
            var $children = $elem.children();
            $children.each(function(){
                var $this = $(this);
                   
                if (condition($this)){
                     callback($this);
                     console.log("Found Control");
                } else {
                    findFirstParent($this);
                }
            });
        };
        
        findFirstParent($(root), function($elem){
            if ($elem.attr("data-controlUrl") && $elem.attr("data-script")){return true;} else {return false;}
        }, function($this){
            var control = $this.data("WEB.ui.ViewController");
            var script = $this.attr("data-script");

            if ((!control || (control && !control.isInitialized)) && script) {
                BASE.require([script], function () {
                    var UIViewController = BASE.getObject(script);
                    var uiViewController = typeof UIViewController === "function" ? new UIViewController() : new WEB.ui.ViewController();
                    uiViewController.view = $this[0];
                    if (uiViewController instanceof WEB.ui.ViewController) {
                    } else {
                        throw new Error(script + " was not an instance of WEB.ui.ViewController");
                    }
                });
            }
        });
    };
    
    if (document.body) {
        $(function () {
            WEB.ui.ViewController.initializeFromRoot();
        });
    }
});
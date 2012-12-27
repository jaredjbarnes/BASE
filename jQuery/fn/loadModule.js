
BASE.require(["jQuery", "jQuery.loadFile", "WEB.MVC"], function () {
    jQuery.fn.loadModule = function (url, options) {
        options = options || {};
        var beforeAppend = options.beforeAppend || function () { };
        var afterAppend = options.afterAppend || function () { };
        var prepend = options.prepend || false;
        var err = options.error || function () {
            throw new Error("Couldn't find module located at \"" + url + "\".");
        };
        return this.each(function () {
            var $this = $(this);
            $.loadFile(url, {
                fromCache: true,
                success: function (html) {
                    var $module = $(html);
                    WEB.MVC.applyTo($module[0], function () {
                        beforeAppend.call($this[0], $module[0]);
                        if (prepend) {
                            $module.prependTo($this);
                        } else {
                            $module.appendTo($this);
                        }
                        afterAppend.call($this[0], $module[0]);
                    });
                },
                error: function () {
                    err.call($this[0]);
                }
            }, function () { });
        });
    };


});
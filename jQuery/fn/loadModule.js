
BASE.require(["jQuery", "jQuery.loadFile", "WEB.MVC"], function () {
    jQuery.fn.loadModule = function (url, options) {
        options = options || {};
        var beforeAppend = options.beforeAppend || function () { };
        var afterAppend = options.afterAppend || function () { };

        var err = options.error || function () {
            throw new Error("Couldn't find module located at \"" + url + "\".");
        };
        return this.each(function () {
            var $this = $(this);
            // This allows custom dom attachment. 
            // If you want to attach it somewhere in the parent besides the end.
            var attachToDom = options.attachToDom || function (parent, module) {
                var $this = $(parent);
                var $module = $(module);

                $module.appendTo($this);
            };

            $.loadFile(url, {
                fromCache: true,
                success: function (html) {
                    var $module = $(html);
                    WEB.MVC.applyTo($module[0], function () {
                        beforeAppend.call($this[0], $module[0]);
                        attachToDom($this[0], $module[0]);
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
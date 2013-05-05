
BASE.require(["jQuery", "jQuery.loadFile", "BASE.web.ui.mvc"], function () {
    jQuery.fn.loadModule = function (url, options) {
        options = options || {};
        var beforeSubviewAdded = options.beforeSubviewAdded || function () { };
        var afterSubviewAdded = options.afterSubviewAdded || function () { };

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
                    BASE.web.ui.mvc.applyTo($module[0], function () {
                        beforeSubviewAdded.call($this[0], $module[0]);
                        attachToDom($this[0], $module[0]);
                        afterSubviewAdded.call($this[0], $module[0]);
                    });
                },
                error: function () {
                    err.call($this[0]);
                }
            }, function () { });
        });
    };


});
BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.AppCategory = (function (Super) {
        var AppCategory = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("AppCategory constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['description'] = null;
            self['apps'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(AppCategory, Super);

        return AppCategory;
    }(Object));
});
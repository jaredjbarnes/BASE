BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel");

    var _globalObject = this;

    LG.core.dataModel.Detail = (function (Super) {
        var Detail = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Detail constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['value'] = null;
            self['subCategory'] = null;
            self['section'] = null;
            self['dataType'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Detail, Super);

        return Detail;
    }(Object));
});
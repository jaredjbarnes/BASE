BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.BaseRole = (function (Super) {
        var BaseRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("BaseRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(BaseRole, Super);

        return BaseRole;
    }(Object));
});
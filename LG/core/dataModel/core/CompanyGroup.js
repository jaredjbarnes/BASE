BASE.require(["LG.core.dataModel.core.Group"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyGroup = (function (Super) {
        var CompanyGroup = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyGroup constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companies'] = [];
                                                  

            return self;
        };

        BASE.extend(CompanyGroup, Super);

        return CompanyGroup;
    }(LG.core.dataModel.core.Group));
});
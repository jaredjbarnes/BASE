BASE.require(["LG.core.dataModel.core.CompanyRoleClosureType"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.MergerClosureType = (function (Super) {
        var MergerClosureType = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("MergerClosureType constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['mergedWith'] = null;
            self['mergedWithId'] = null;
                                                  

            return self;
        };

        BASE.extend(MergerClosureType, Super);

        return MergerClosureType;
    }(LG.core.dataModel.core.CompanyRoleClosureType));
});
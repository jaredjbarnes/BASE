BASE.require(["LG.core.dataModel.core.ManagementSystemDatabase"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.TAMDatabase = (function (Super) {
        var TAMDatabase = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("TAMDatabase constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['dataSource'] = null;
                                                  

            return self;
        };

        BASE.extend(TAMDatabase, Super);

        return TAMDatabase;
    }(LG.core.dataModel.core.ManagementSystemDatabase));
});
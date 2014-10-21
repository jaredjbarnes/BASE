BASE.require(["LG.core.dataModel.core.Credential"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.DatabaseCredential = (function (Super) {
        var DatabaseCredential = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("DatabaseCredential constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['username'] = null;
                                                  

            return self;
        };

        BASE.extend(DatabaseCredential, Super);

        return DatabaseCredential;
    }(LG.core.dataModel.core.Credential));
});
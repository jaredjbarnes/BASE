BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.ManagementSystemDatabase = (function (Super) {
        var ManagementSystemDatabase = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ManagementSystemDatabase constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['description'] = null;
            self['permanentId'] = null;
            self['managementSystems'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(ManagementSystemDatabase, Super);

        return ManagementSystemDatabase;
    }(Object));
});
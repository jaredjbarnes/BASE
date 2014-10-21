BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.ManagementSystem = (function (Super) {
        var ManagementSystem = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ManagementSystem constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['description'] = null;
            self['companyId'] = null;
            self['company'] = null;
            self['managementSystemDatabaseId'] = null;
            self['managementSystemDatabase'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(ManagementSystem, Super);

        return ManagementSystem;
    }(Object));
});
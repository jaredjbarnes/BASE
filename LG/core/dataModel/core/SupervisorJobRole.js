BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.SupervisorJobRole = (function (Super) {
        var SupervisorJobRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SupervisorJobRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['jobRoleId'] = null;
            self['jobRole'] = null;
            self['supervisorRoleId'] = null;
            self['supervisorRole'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(SupervisorJobRole, Super);

        return SupervisorJobRole;
    }(Object));
});
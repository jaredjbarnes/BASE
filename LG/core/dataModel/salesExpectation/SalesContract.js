BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var _globalObject = this;

    LG.core.dataModel.salesExpectation.SalesContract = (function (Super) {
        var SalesContract = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SalesContract constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['contractName'] = null;
            self['existingInvestment'] = null;
            self['forgivenInvestment'] = null;
            self['retentionPercent'] = null;
            self['created'] = null;
            self['createdById'] = null;
            self['createdBy'] = null;
            self['approved'] = null;
            self['approvedById'] = null;
            self['approvedBy'] = null;
            self['LGEmployeeRoleId'] = null;
            self['LGEmployeeRole'] = null;
            self['agencyRoleId'] = null;
            self['agencyRole'] = null;
            self['expectations'] = [];
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(SalesContract, Super);

        return SalesContract;
    }(Object));
});
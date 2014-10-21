BASE.require(["LG.core.dataModel.core.JobRoleDataPoint"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.ProducerRoleDataPoint = (function (Super) {
        var ProducerRoleDataPoint = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ProducerRoleDataPoint constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['salesContracts'] = [];
            self['preOpportunities'] = [];
            self['opportunities'] = [];
            self['producerPartners'] = [];
                                                  

            return self;
        };

        BASE.extend(ProducerRoleDataPoint, Super);

        return ProducerRoleDataPoint;
    }(LG.core.dataModel.core.JobRoleDataPoint));
});
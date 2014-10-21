BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.BaseChangeTracking = (function (Super) {
        var BaseChangeTracking = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("BaseChangeTracking constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['created'] = null;
            self['createdBy'] = null;
            self['createdById'] = null;
            self['lastModified'] = null;
            self['lastModifiedBy'] = null;
            self['lastModifiedById'] = null;
                                                  

            return self;
        };

        BASE.extend(BaseChangeTracking, Super);

        return BaseChangeTracking;
    }(Object));
});
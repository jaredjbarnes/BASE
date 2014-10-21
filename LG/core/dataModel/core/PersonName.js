BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonName = (function (Super) {
        var PersonName = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonName constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['firstName'] = null;
            self['lastName'] = null;
            self['middleName'] = null;
            self['type'] = null;
            self['personId'] = null;
            self['person'] = null;
            self['id'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonName, Super);

        return PersonName;
    }(Object));
});
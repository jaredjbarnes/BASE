BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.PeopleGroupToPermission = (function (Super) {
        var PeopleGroupToPermission = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PeopleGroupToPermission();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(PeopleGroupToPermission, Super);

        return PeopleGroupToPermission;
    }(Object));
});
BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.PersonToPeopleGroup = (function (Super) {
        var PersonToPeopleGroup = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PersonToPeopleGroup();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(PersonToPeopleGroup, Super);

        return PersonToPeopleGroup;
    }(Object));
});

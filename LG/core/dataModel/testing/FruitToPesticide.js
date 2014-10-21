BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.testing");

    LG.core.dataModel.testing.FruitToPesticide = (function (Super) {
        var FruitToPesticide = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new FruitToPesticide();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(FruitToPesticide, Super);

        return FruitToPesticide;
    }(Object));
});

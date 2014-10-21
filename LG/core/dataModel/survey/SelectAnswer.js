BASE.require(["LG.core.dataModel.survey.Answer"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.SelectAnswer = (function (Super) {
        var SelectAnswer = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SelectAnswer constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['selectQuestionId'] = null;
            self['selectQuestion'] = null;
            self['possibleAnswerId'] = null;
            self['possibleAnswer'] = null;
                                                  

            return self;
        };

        BASE.extend(SelectAnswer, Super);

        return SelectAnswer;
    }(LG.core.dataModel.survey.Answer));
});
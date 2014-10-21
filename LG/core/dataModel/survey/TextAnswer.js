BASE.require(["LG.core.dataModel.survey.Answer"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.TextAnswer = (function (Super) {
        var TextAnswer = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("TextAnswer constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['value'] = null;
            self['textQuestionId'] = null;
            self['textQuestion'] = null;
                                                  

            return self;
        };

        BASE.extend(TextAnswer, Super);

        return TextAnswer;
    }(LG.core.dataModel.survey.Answer));
});
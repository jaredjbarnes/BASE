BASE.require(["LG.core.dataModel.survey.Question"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.TextQuestion = (function (Super) {
        var TextQuestion = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("TextQuestion constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['recommendedCharacterLength'] = null;
            self['textAnswers'] = [];
                                                  

            return self;
        };

        BASE.extend(TextQuestion, Super);

        return TextQuestion;
    }(LG.core.dataModel.survey.Question));
});
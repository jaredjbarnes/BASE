BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.PossibleAnswerSet = (function (Super) {
        var PossibleAnswerSet = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PossibleAnswerSet constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['possibleAnswers'] = [];
            self['selectQuestions'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PossibleAnswerSet, Super);

        return PossibleAnswerSet;
    }(Object));
});
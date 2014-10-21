BASE.require(["LG.core.dataModel.survey.Question"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.SelectQuestion = (function (Super) {
        var SelectQuestion = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SelectQuestion constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['allowMultipleSelection'] = null;
            self['isScorable'] = null;
            self['possibleAnswerSetId'] = null;
            self['possibleAnswerSet'] = null;
            self['selectAnswers'] = [];
                                                  

            return self;
        };

        BASE.extend(SelectQuestion, Super);

        return SelectQuestion;
    }(LG.core.dataModel.survey.Question));
});
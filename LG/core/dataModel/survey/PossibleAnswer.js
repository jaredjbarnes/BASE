BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.PossibleAnswer = (function (Super) {
        var PossibleAnswer = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PossibleAnswer constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['value'] = null;
            self['sortOrder'] = null;
            self['possibleAnswerSetId'] = null;
            self['possibleAnswerSet'] = null;
            self['selectAnswers'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PossibleAnswer, Super);

        return PossibleAnswer;
    }(Object));
});
BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.Answer = (function (Super) {
        var Answer = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Answer constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['surveyResultId'] = null;
            self['surveyResult'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Answer, Super);

        return Answer;
    }(Object));
});
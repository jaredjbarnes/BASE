BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.SurveyResult = (function (Super) {
        var SurveyResult = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SurveyResult constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['surveyId'] = null;
            self['survey'] = null;
            self['takerId'] = null;
            self['taker'] = null;
            self['expirationDate'] = null;
            self['dateRequested'] = null;
            self['requesterId'] = null;
            self['requester'] = null;
            self['dateTaken'] = null;
            self['answers'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(SurveyResult, Super);

        return SurveyResult;
    }(Object));
});
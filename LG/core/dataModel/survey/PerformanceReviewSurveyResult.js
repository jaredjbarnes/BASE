BASE.require(["LG.core.dataModel.survey.SurveyResult"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.PerformanceReviewSurveyResult = (function (Super) {
        var PerformanceReviewSurveyResult = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PerformanceReviewSurveyResult constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['revieweeId'] = null;
            self['reviewee'] = null;
            self['supervisorComments'] = [];
                                                  

            return self;
        };

        BASE.extend(PerformanceReviewSurveyResult, Super);

        return PerformanceReviewSurveyResult;
    }(LG.core.dataModel.survey.SurveyResult));
});
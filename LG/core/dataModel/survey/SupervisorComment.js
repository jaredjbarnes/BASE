BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.SupervisorComment = (function (Super) {
        var SupervisorComment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SupervisorComment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['performanceReviewSurveyResultId'] = null;
            self['performanceReviewSurveyResult'] = null;
            self['value'] = null;
            self['isPublic'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(SupervisorComment, Super);

        return SupervisorComment;
    }(Object));
});
BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.Survey = (function (Super) {
        var Survey = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Survey constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['description'] = null;
            self['type'] = null;
            self['categories'] = [];
            self['results'] = [];
            self['allowAnonymousSurveyTakers'] = null;
            self['creatorId'] = null;
            self['creator'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Survey, Super);

        return Survey;
    }(Object));
});
BASE.require([
    "BASE.data.DataContext",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonEmailAddress",
    "LG.core.dataModel.survey.Service",
    "LG.core.dataModel.survey.Answer",
    "LG.core.dataModel.survey.Category",
    "LG.core.dataModel.survey.PerformanceReviewSurveyResult",
    "LG.core.dataModel.survey.PossibleAnswer",
    "LG.core.dataModel.survey.PossibleAnswerSet",
    "LG.core.dataModel.survey.Question",
    "LG.core.dataModel.survey.SelectAnswer",
    "LG.core.dataModel.survey.Survey",
    "LG.core.dataModel.survey.SurveyResult",
    "LG.core.dataModel.survey.TextAnswer",
    "LG.core.dataModel.survey.TextQuestion"
], function () {

    BASE.namespace("LG.core.dataModel.survey");

    LG.core.dataModel.survey.DataContext = (function (Super) {

        var DataContext = function (appId, userToken) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataContext(appId, userToken);
            }

            Super.call(self);

            Object.defineProperty(self, "appId", {
                get: function () {
                    return appId;
                }
            });

            var _token = userToken;
            Object.defineProperty(self, "token", {
                get: function () {
                    return _token;
                },
                set: function (value) {
                    _token = value;
                    self.service.ajaxProvider.setToken(value);
                }
            });

            self.service = new LG.core.dataModel.survey.Service(appId, userToken, self.relationships);
            self.people = new BASE.data.DataSet(LG.core.dataModel.core.Person, self);
            self.personEmailAddresses = new BASE.data.DataSet(LG.core.dataModel.core.PersonEmailAddress, self);
            self.answers = new BASE.data.DataSet(LG.core.dataModel.survey.Answer, self);
            self.categories = new BASE.data.DataSet(LG.core.dataModel.survey.Category, self);
            self.performanceReviewSurveyResults = new BASE.data.DataSet(LG.core.dataModel.survey.PerformanceReviewSurveyResult, self);
            self.possibleAnswers = new BASE.data.DataSet(LG.core.dataModel.survey.PossibleAnswer, self);
            self.possibleAnswerSets = new BASE.data.DataSet(LG.core.dataModel.survey.PossibleAnswerSet, self);
            self.questions = new BASE.data.DataSet(LG.core.dataModel.survey.Question, self);
            self.selectAnswers = new BASE.data.DataSet(LG.core.dataModel.survey.SelectAnswer, self);
            self.surveys = new BASE.data.DataSet(LG.core.dataModel.survey.Survey, self);
            self.surveyResults = new BASE.data.DataSet(LG.core.dataModel.survey.SurveyResult, self);
            self.textAnswers = new BASE.data.DataSet(LG.core.dataModel.survey.TextAnswer, self);
            self.textQuestions = new BASE.data.DataSet(LG.core.dataModel.survey.TextQuestion, self);

            return self;
        };
        BASE.extend(DataContext, Super);

        return DataContext;
    }(BASE.data.DataContext));
});
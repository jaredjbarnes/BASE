BASE.require([
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonEmailAddress",
    "LG.rest.Service",
    "LG.JsonAjaxProvider",
    "LG.core.dataModel.survey.Answer",
    "LG.core.dataModel.survey.Category",
    "LG.core.dataModel.survey.PerformanceReviewSurveyResult",
    "LG.core.dataModel.survey.PossibleAnswer",
    "LG.core.dataModel.survey.PossibleAnswerSet",
    "LG.core.dataModel.survey.Question",
    "LG.core.dataModel.survey.SelectAnswer",
    "LG.core.dataModel.survey.SelectQuestion",
    "LG.core.dataModel.survey.Survey",
    "LG.core.dataModel.survey.SurveyResult",
    "LG.core.dataModel.survey.TextAnswer",
    "LG.core.dataModel.survey.TextQuestion",
    "LG.core.dataModel.survey.SupervisorComment"
], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.survey.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            Super.call(self);

            self.host = "https://api.leavitt.com";
            //self.host = "http://localhost:3508";
            self.ajaxProvider = new LG.JsonAjaxProvider(appId, token);

            // This is the same as above, but I'm lazily doing it this way instead.
            var serverUrisToTypes = {
                "/Core/People": LG.core.dataModel.core.Person,
                "/Core/PersonEmailAddresses": LG.core.dataModel.core.PersonEmailAddress,
                "/Survey/Answers": LG.core.dataModel.survey.Answer,
                "/Survey/Categories": LG.core.dataModel.survey.Category,
                "/Survey/PerformanceReviewSurveyResults": LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                "/Survey/PossibleAnswers": LG.core.dataModel.survey.PossibleAnswer,
                "/Survey/PossibleAnswerSets": LG.core.dataModel.survey.PossibleAnswerSet,
                "/Survey/Questions": LG.core.dataModel.survey.Question,
                "/Survey/SelectAnswers": LG.core.dataModel.survey.SelectAnswer,
                "/Survey/SelectQuestions": LG.core.dataModel.survey.SelectQuestion,
                "/Survey/Surveys": LG.core.dataModel.survey.Survey,
                "/Survey/SurveyResults": LG.core.dataModel.survey.SurveyResult,
                "/Survey/TextAnswers": LG.core.dataModel.survey.TextAnswer,
                "/Survey/TextQuestions": LG.core.dataModel.survey.TextQuestion,
                "/Survey/SupervisorComments": LG.core.dataModel.survey.SupervisorComment
            };

            for (var uri in serverUrisToTypes) {
                self.typeUri.add(serverUrisToTypes[uri], uri);
            }

            var serverTypesToClientTypes = {
                "Person": LG.core.dataModel.core.Person,
                "PersonEmailAddress": LG.core.dataModel.core.PersonEmailAddress,
                "Answer": LG.core.dataModel.survey.Answer,
                "Category": LG.core.dataModel.survey.Category,
                "PerformanceReviewSurveyResult": LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                "PossibleAnswer": LG.core.dataModel.survey.PossibleAnswer,
                "PossibleAnswerSet": LG.core.dataModel.survey.PossibleAnswerSet,
                "Question": LG.core.dataModel.survey.Question,
                "SelectAnswer": LG.core.dataModel.survey.SelectAnswer,
                "SelectQuestion": LG.core.dataModel.survey.SelectQuestion,
                "Survey": LG.core.dataModel.survey.Survey,
                "SurveyResult": LG.core.dataModel.survey.SurveyResult,
                "TextAnswer": LG.core.dataModel.survey.TextAnswer,
                "TextQuestion": LG.core.dataModel.survey.TextQuestion,
                "SupervisorComment": LG.core.dataModel.survey.SupervisorComment
            };

            for (var type in serverTypesToClientTypes) {
                self.serverTypeToClientType.add(type, serverTypesToClientTypes[type]);
            }

            self.relationships = {
                oneToOne: [],
                oneToMany: [{
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "revieweeSurveys",
                    ofType: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                    withKey: "id",
                    withForeignKey: "revieweeId",
                    withOne: "reviewee"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "requestedSurveys",
                    ofType: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                    withKey: "id",
                    withForeignKey: "requesterId",
                    withOne: "requester"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "takenSurveys",
                    ofType: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                    withKey: "id",
                    withForeignKey: "takerId",
                    withOne: "taker"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "surveys",
                    ofType: LG.core.dataModel.survey.Survey,
                    withKey: "id",
                    withForeignKey: "creatorId",
                    withOne: "creator"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "takenSurveys",
                    ofType: LG.core.dataModel.survey.SurveyResult,
                    withKey: "id",
                    withForeignKey: "takerId",
                    withOne: "taker"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "requestedSurveys",
                    ofType: LG.core.dataModel.survey.SurveyResult,
                    withKey: "id",
                    withForeignKey: "requesterId",
                    withOne: "requester"
                }, {
                    type: LG.core.dataModel.survey.SurveyResult,
                    hasKey: "id",
                    hasMany: "answers",
                    ofType: LG.core.dataModel.survey.Answer,
                    withKey: "id",
                    withForeignKey: "surveyResultId",
                    withOne: "surveyResult"
                }, {
                    type: LG.core.dataModel.survey.Category,
                    hasKey: "id",
                    hasMany: "questions",
                    ofType: LG.core.dataModel.survey.Question,
                    withKey: "id",
                    withForeignKey: "categoryId",
                    withOne: "category"
                }, {
                    type: LG.core.dataModel.survey.PossibleAnswerSet,
                    hasKey: "id",
                    hasMany: "selectQuestions",
                    ofType: LG.core.dataModel.survey.SelectQuestion,
                    withKey: "id",
                    withForeignKey: "possibleAnswerSetId",
                    withOne: "possibleAnswerSet"
                }, {
                    type: LG.core.dataModel.survey.PossibleAnswerSet,
                    hasKey: "id",
                    hasMany: "possibleAnswers",
                    ofType: LG.core.dataModel.survey.PossibleAnswer,
                    withKey: "id",
                    withForeignKey: "possibleAnswerSetId",
                    withOne: "possibleAnswerSet"
                }, {
                    type: LG.core.dataModel.survey.PossibleAnswer,
                    hasKey: "id",
                    hasMany: "selectAnswers",
                    ofType: LG.core.dataModel.survey.SelectAnswer,
                    withKey: "id",
                    withForeignKey: "possibleAnswerId",
                    withOne: "possibleAnswer"
                }, {
                    type: LG.core.dataModel.survey.SelectQuestion,
                    hasKey: "id",
                    hasMany: "selectAnswers",
                    ofType: LG.core.dataModel.survey.SelectAnswer,
                    withKey: "id",
                    withForeignKey: "selectQuestionId",
                    withOne: "selectQuestion"
                }, {
                    type: LG.core.dataModel.survey.TextQuestion,
                    hasKey: "id",
                    hasMany: "textAnswers",
                    ofType: LG.core.dataModel.survey.TextAnswer,
                    withKey: "id",
                    withForeignKey: "textQuestionId",
                    withOne: "textQuestion"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "emailAddresses",
                    ofType: LG.core.dataModel.core.PersonEmailAddress,
                    withKey: "id",
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.survey.Survey,
                    hasKey: "id",
                    hasMany: "categories",
                    ofType: LG.core.dataModel.survey.Category,
                    withKey: "id",
                    withForeignKey: "surveyId",
                    withOne: "survey"
                }, {
                    type: LG.core.dataModel.survey.Survey,
                    hasKey: "id",
                    hasMany: "results",
                    ofType: LG.core.dataModel.survey.SurveyResult,
                    withKey: "id",
                    withForeignKey: "surveyId",
                    withOne: "survey"
                }, {
                    type: LG.core.dataModel.survey.Survey,
                    hasKey: "id",
                    hasMany: "performanceReviewSurveyResults",
                    ofType: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                    withKey: "id",
                    withForeignKey: "surveyId",
                    withOne: "survey"
                }, {
                    type: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                    hasKey: "id",
                    hasMany: "supervisorComments",
                    ofType: LG.core.dataModel.survey.SupervisorComment,
                    withKey: "id",
                    withForeignKey: "performanceReviewSurveyResultId",
                    withOne: "performanceReviewSurveyResult"
                }// , {
                //    type: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                //    "extends": LG.core.dataModel.survey.SurveyResult,
                //    hasKey: "id",
                //    hasMany: "answers",
                //    ofType: LG.core.dataModel.survey.Answer,
                //    withKey: "id",
                //    withForeignKey: "surveyResultId",
                //    withOne: "surveyResult"
                //}, {
                //    type: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                //    "extends": LG.core.dataModel.survey.SurveyResult,
                //    hasKey: "id",
                //    hasMany: "selectAnswers",
                //    ofType: LG.core.dataModel.survey.SelectAnswer,
                //    withKey: "id",
                //    withForeignKey: "surveyResultId",
                //    withOne: "surveyResult"
                //}, {
                //    type: LG.core.dataModel.survey.PerformanceReviewSurveyResult,
                //    "extends": LG.core.dataModel.survey.SurveyResult,
                //    hasKey: "id",
                //    hasMany: "textAnswers",
                //    ofType: LG.core.dataModel.survey.TextAnswer,
                //    withKey: "id",
                //    withForeignKey: "surveyResultId",
                //    withOne: "surveyResult"
                //}


                ]
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});
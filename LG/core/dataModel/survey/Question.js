BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.Question = (function (Super) {
        var Question = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Question constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['categoryId'] = null;
            self['category'] = null;
            self['value'] = null;
            self['isRequired'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Question, Super);

        return Question;
    }(Object));
});
BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.survey");

    var _globalObject = this;

    LG.core.dataModel.survey.Category = (function (Super) {
        var Category = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Category constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['description'] = null;
            self['surveyId'] = null;
            self['survey'] = null;
            self['questions'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Category, Super);

        return Category;
    }(Object));
});
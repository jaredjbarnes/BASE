BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.App = (function (Super) {
        var App = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("App constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['permissions'] = [];
            self['uri'] = null;
            self['color'] = null;
            self['name'] = null;
            self['accessPermissionId'] = null;
            self['accessPermission'] = null;
            self['dataControl'] = null;
            self['description'] = null;
            self['categoryId'] = null;
            self['category'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(App, Super);

        return App;
    }(Object));
});
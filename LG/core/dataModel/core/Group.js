BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Group = (function (Super) {
        var Group = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Group constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['description'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Group, Super);

        return Group;
    }(Object));
});
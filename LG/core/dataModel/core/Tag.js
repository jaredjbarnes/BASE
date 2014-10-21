BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Tag = (function (Super) {
        var Tag = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Tag constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['personId'] = null;
            self['person'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Tag, Super);

        return Tag;
    }(Object));
});
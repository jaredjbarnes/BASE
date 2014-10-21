BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Attachment = (function (Super) {
        var Attachment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Attachment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['dateCreated'] = null;
            self['name'] = null;
            self['description'] = null;
            self['fileName'] = null;
            self['extension'] = null;
            self['contentType'] = null;
            self['owner'] = null;
            self['ownerId'] = null;
            self['peoplePermissions'] = [];
            self['groupPermissions'] = [];
            self['allowGuestReadAccess'] = null;
            self['storageFileName'] = null;
            self['length'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Attachment, Super);

        return Attachment;
    }(Object));
});
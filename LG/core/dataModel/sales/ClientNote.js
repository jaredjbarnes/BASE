BASE.require(["LG.core.dataModel.core.Note"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientNote = (function (Super) {
        var ClientNote = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientNote constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientId'] = null;
            self['client'] = null;
            self['clientNoteReminder'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientNote, Super);

        return ClientNote;
    }(LG.core.dataModel.core.Note));
});
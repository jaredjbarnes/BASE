BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientNoteReminder = (function (Super) {
        var ClientNoteReminder = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientNoteReminder constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['note'] = null;
            self['reminderDateTime'] = null;
            self['reminderSentDateTime'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientNoteReminder, Super);

        return ClientNoteReminder;
    }(Object));
});
BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Person = (function (Super) {
        var Person = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Person constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['firstName'] = null;
            self['lastName'] = null;
            self['middleName'] = null;
            self['dateOfBirth'] = null;
            self['biography'] = null;
            self['gender'] = null;
            self['dateCreated'] = null;
            self['names'] = [];
            self['credentials'] = [];
            self['emailAddresses'] = [];
            self['peopleGroups'] = [];
            self['roles'] = [];
            self['permissions'] = [];
            self['permissionGroups'] = [];
            self['phoneNumbers'] = [];
            self['addresses'] = [];
            self['ultiProAccounts'] = [];
            self['myAttachments'] = [];
            self['tags'] = [];
            self['ldapAccount'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Person, Super);

        return Person;
    }(Object));
});
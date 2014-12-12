BASE.require([
    "BASE.data.Edm",
    "BASE.data.testing.model.person",
    "BASE.data.testing.model.permission",
    "BASE.data.testing.model.phoneNumber",
    "BASE.data.testing.model.address",
    "BASE.data.testing.model.hrAccount",
    "BASE.data.testing.model.personToPermission",
    "BASE.data.testing.relationships.personHasManyAddresses",
    "BASE.data.testing.relationships.personHasManyPermissions",
    "BASE.data.testing.relationships.personHasManyPhoneNumbers",
    "BASE.data.testing.relationships.personHasOneHrAccount"
], function () {
    
    var Edm = BASE.data.Edm;
    var person = BASE.data.testing.model.person;
    var permission = BASE.data.testing.model.permission
    var phoneNumber = BASE.data.testing.model.phoneNumber
    var address = BASE.data.testing.model.address
    var hrAccount = BASE.data.testing.model.hrAccount
    var personToPermission = BASE.data.testing.model.personToPermission
    var personHasManyAddresses = BASE.data.testing.relationships.personHasManyAddresses
    var personHasManyPermissions = BASE.data.testing.relationships.personHasManyPermissions
    var personHasManyPhoneNumber = BASE.data.testing.relationships.personHasManyPhoneNumbers
    var personHasOneHrAccount = BASE.data.testing.relationships.personHasOneHrAccount
    
    BASE.namespace("BASE.data.testing");
    
    BASE.data.testing.Edm = function () {
        var self = this;
        Edm.call(self);
        
        self.addModel(person);
        self.addModel(permission);
        self.addModel(address);
        self.addModel(hrAccount);
        self.addModel(phoneNumber);
        self.addModel(personToPermission);
        
        self.addOneToOne(personHasOneHrAccount);
        self.addOneToMany(personHasManyAddresses);
        self.addOneToMany(personHasManyPhoneNumber);
        self.addManyToMany(personHasManyPermissions);

    };
    
    BASE.extend(BASE.data.testing.Edm, Edm);

});
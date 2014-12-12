BASE.require([
    "BASE.data.testing.Person",
    "BASE.data.testing.PhoneNumber"
], function () {
    
    BASE.namespace("BASE.data.testing.relationships");
    
    BASE.data.testing.relationships.personHasManyPhoneNumbers = {
        type: BASE.data.testing.Person,
        hasKey: "id",
        hasMany: "phoneNumbers",
        ofType: BASE.data.testing.PhoneNumber,
        withKey: "id",
        withForeignKey: "personId",
        withOne: "person"
    };

});
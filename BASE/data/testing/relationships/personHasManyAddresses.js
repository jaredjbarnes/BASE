BASE.require([
    "BASE.data.testing.Person",
    "BASE.data.testing.Address"
], function () {
    
    BASE.namespace("BASE.data.testing.relationships");
    
    BASE.data.testing.relationships.personHasManyAddresses = {
        type: BASE.data.testing.Person,
        hasKey: "id",
        hasMany: "addresses",
        ofType: BASE.data.testing.Address,
        withKey: "id",
        withForeignKey: "personId",
        withOne: "person"
    };

});
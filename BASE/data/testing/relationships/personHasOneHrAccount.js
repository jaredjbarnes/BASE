BASE.require([
    "BASE.data.testing.Person",
    "BASE.data.testing.HrAccount"
], function () {
    
    BASE.namespace("BASE.data.testing.relationships");
    
    BASE.data.testing.relationships.personHasOneHrAccount = {
        type: BASE.data.testing.Person,
        hasKey: "id",
        hasOne: "hrAccount",
        ofType: BASE.data.testing.HrAccount,
        withKey: "id",
        withForeignKey: "personId",
        withOne: "person"
    };

});
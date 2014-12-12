BASE.require([
    "BASE.data.testing.Person",
    "BASE.data.testing.Permission",
    "BASE.data.testing.PersonToPermission"
], function () {
    
    BASE.namespace("BASE.data.testing.relationships");
    
    BASE.data.testing.relationships.personHasManyPermissions = {
        type: BASE.data.testing.Person,
        hasKey: "id",
        hasForeignKey: "permissionId",
        hasMany: "permissions",
        ofType: BASE.data.testing.Permission,
        withKey: "id",
        withForeignKey: "personId",
        withMany: "people",
        usingMappingType: BASE.data.testing.PersonToPermission
    };

});
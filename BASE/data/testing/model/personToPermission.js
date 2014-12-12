BASE.require(["BASE.data.testing.PersonToPermission"], function () {
    
    var PersonToPermission = BASE.data.testing.PersonToPermission;
    
    BASE.namespace("BASE.data.testing.model");
    
    BASE.data.testing.model.personToPermission = {
        type: PersonToPermission,
        properties: {
            personId: {
                type: Integer,
                primaryKey: true
            },
            permissionId: {
                type: Integer,
                primaryKey: true
            }
        }
    };

});

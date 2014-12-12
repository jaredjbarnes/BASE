BASE.require(["BASE.data.testing.Permission"], function () {
    
    var Permission = BASE.data.testing.Permission;
    
    BASE.namespace("BASE.data.testing.model");
    
    BASE.data.testing.model.permission = {
        type: Permission,
        collectionName: "permissions",
        properties: {
            id: {
                type: Integer,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: String
            }
        }
    };

});

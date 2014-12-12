BASE.require(["BASE.data.testing.Address"], function () {
    
    var Address = BASE.data.testing.Address;
    
    BASE.namespace("BASE.data.testing.model");
    
    BASE.data.testing.model.address = {
        type: Address,
        collectionName: "addresses",
        properties: {
            id: {
                type: Integer,
                primaryKey: true,
                autoIncrement: true
            },
            street: {
                type: String
            },
            street: {
                type: String
            },
            city: {
                type: String
            },
            zip: {
                type: String
            },
            country: {
                type: String
            },
            personId: {
                type: Integer
            }
        }
    };

});


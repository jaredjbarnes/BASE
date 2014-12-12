BASE.require(["BASE.data.testing.PhoneNumber"], function () {
    
    var PhoneNumber = BASE.data.testing.PhoneNumber;
    
    BASE.namespace("BASE.data.testing.model");
    
    BASE.data.testing.model.phoneNumber = {
        type: PhoneNumber,
        collectionName: "phoneNumbers",
        properties: {
            id: {
                type: Integer,
                primaryKey: true,
                autoIncrement: true
            },
            areacode: {
                type: Integer
            },
            lineNumber: {
                type: Integer
            },
            personId: {
                type: Integer
            }
        }
    };

});

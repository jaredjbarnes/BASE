BASE.require(["BASE.data.testing.Person"], function () {
    
    var Person = BASE.data.testing.Person;
    
    BASE.namespace("BASE.data.testing.model");
    
    BASE.data.testing.model.person = {
        type: Person,
        collectionName: "people",
        properties: {
            id: {
                type: Integer,
                primaryKey: true,
                autoIncrement: true
            },
            firstName: {
                type: String
            },
            lastName: {
                type: String
            },
            age: {
                type: Integer
            },
            dateOfBirth: {
                type: DateTimeOffset
            }
        }
    };

});

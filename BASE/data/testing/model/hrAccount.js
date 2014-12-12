BASE.require(["BASE.data.testing.HrAccount"], function () {
    
    var HrAccount = BASE.data.testing.HrAccount;
    
    BASE.namespace("BASE.data.testing.model");
    
    BASE.data.testing.model.hrAccount = {
        type: HrAccount,
        collectionName: "hrAccounts",
        properties: {
            id: {
                type: Integer,
                primaryKey: true,
                autoIncrement: true
            },
            accountId: {
                type: Integer
            },
            personId: {
                type: Integer
            }
        }
    };

});

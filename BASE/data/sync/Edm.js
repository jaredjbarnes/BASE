BASE.require([
    "BASE.data.Edm"
    ], function () {
    
    BASE.namespace("BASE.data.sync");
    
    var Edm = BASE.data.Edm;
    
    BASE.data.sync.Edm = function () {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        Edm.call(self);
        
        var Status = self.createModel({
            collectionName: "statuses",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                status: {
                    type: String
                },
                modifiedDate: {
                    type: Date
                }
            }
        });
        
        var StatusDatum = self.createModel({
            collectionName: "statusData",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                json: {
                    type: String
                },
                statusId: {
                    type: Integer
                }
            }
        });
        
        var PrimaryKey = self.createModel({
            collectionName: "primaryKeys",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                local: {
                    type: Integer
                },
                remote: {
                    type: Integer
                },
                fieldName: {
                    type: String
                },
                tableName: {
                    type: String
                },
                statusId: {
                    type: Integer
                }
            }
        });
        
        var SyncError = self.createModel({
            collectionName: "syncErrors",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                message: {
                    type: String
                },
                statusId: {
                    type: Integer
                }
            }
        });
        
        var SyncDatum = self.createModel({
            collectionName: "syncData",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                startDate: {
                    type: Date
                },
                endDate: {
                    type: Date
                },
                isComplete: {
                    type: Boolean,
                    defaultValue: false
                }
            }
        });
        
        self.addOneToOne({
            type: Status,
            hasKey: "id",
            hasOne: "data",
            ofType: StatusDatum,
            withKey: "id",
            withForeignKey: "statusId",
            withOne: "status"
        });
        
        self.addOneToOne({
            type: Status,
            hasKey: "id",
            hasOne: "error",
            ofType: SyncError,
            withKey: "id",
            withForeignKey: "statusId",
            withOne: "status"
        });
        
        self.addOneToMany({
            type: Status,
            hasKey: "id",
            hasMany: "primaryKeys",
            ofType: PrimaryKey,
            withKey: "id",
            withForeignKey: "statusId",
            withOne: "status"
        });
         
    };
    
    BASE.extend(BASE.data.sync.Edm, BASE.data.Edm);

});
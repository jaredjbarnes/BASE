BASE.require([
    "BASE.data.Edm"
    ], function () {
    
    BASE.namespace("BASE.data");
    
    var Status = function () {
        var self = this;
        
        self.id = null;
        self.localPrimaryKey = null;
        self.remotePrimaryKey = null;
        self.tableName = null;
        self.status = null;
        self.error = null;
        self.data = null;
    };
    
    var StatusDatum = function () {
        var self = this;
        self.id = null;
        self.statusId = null;
        self.json = null;
        self.status = null;
    };
    
    var SyncError = function () {
        var self = this;
        self.id = null;
        self.statusId = null;
        self.message = null;
        self.status = null;
    };
    
    var Edm = BASE.data.Edm;
    
    BASE.data.PersistentChangeTrackerEdm = function () {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        BASE.data.Edm.call(self);
        
        self.addModel({
            type: Status,
            collectionName: "statuses",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                remotePrimaryKey: {
                    type: String
                },
                localPrimaryKey: {
                    type: String
                },
                tableName: {
                    type: String
                },
                status: {
                    type: String
                }
            }
        });
        
        self.addModel({
            type: StatusDatum,
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
        
        self.addModel({
            type: SyncError,
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
         
    };
    
    BASE.data.PersistentChangeTrackerEdm.Status = Status;
    BASE.data.PersistentChangeTrackerEdm.StatusDatum = StatusDatum;

});
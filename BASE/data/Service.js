BASE.require([
    "BASE.collections.Hashmap",
    "BASE.query.Queryable",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.ErrorResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.mirrors.reflect"
], function () {
    
    BASE.namespace("BASE.data");
    
    BASE.data.Service = function (relationships) {
        var self = this;
        
        self.add = function (entity) {
            /// <summary>Adds an entity to persistence.</summary>
            /// <param type="Object" name="entity">The object that is going to be persisted.</param>
            /// <returns type="Future">This is a Future of Type AddedResponse.</returns>
            throw new Error("This was meant to be overridden.");
        };
        
        self.update = function (entity, updates) {
            /// <summary>This updates an already persisted entity. The entity needs to have a primary key assigned or an ErrorResponse will be returned.</summary>
            /// <param type="Object" name="entity">The object that is going to be updated.</param>
            /// <param type="Object" name="updates">A key/value pair object of changes.</param>
            /// <returns type="Future">This is a Future of Type UpdateResponse.</returns>
            throw new Error("This was meant to be overridden.");
        };
        
        self.remove = function (entity) {
            /// <summary>
            ///     This removes an entity from persisting anymore. 
            ///     The entity needs to have a primary key assigned or an ErrorResponse will be returned.
            /// </summary>
            /// <param type="Object" name="entity">The object that is going to be updated.</param>
            /// <returns type="Future">This is a Future of Type RemovedResponse.</returns>
            throw new Error("This was meant to be overridden.");
        };
        
        self.getSourcesOneToOneTargetEntity = function (sourceEntity, relationship) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getTargetsOneToOneSourceEntity = function (targetEntity, relationship) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getSourcesOneToManyQueryProvider = function (sourceEntity, relationship) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getTargetsOneToManySourceEntity = function (targetEntity, relationship) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getSourcesManyToManyQueryProvider = function (sourceEntity, relationship) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getTargetsManyToManyQueryProvider = function (targetEntity, relationship) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getQueryProvider = function (Type) {
            throw new Error("This was meant to be overridden.");
        };

    };

});
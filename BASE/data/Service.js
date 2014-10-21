﻿BASE.require([
    "BASE.collections.Hashmap",
    "BASE.query.Queryable",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.ErrorResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse"
], function () {
    
    BASE.namespace("BASE.data");
    
    BASE.data.Service = function (edm) {
        var self = this;
        
        self.add = function (entity) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.update = function (entity, updates) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.remove = function (entity) {
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
        
        self.asQueryable = function (Type) {
            throw new Error("This was meant to be overridden.");
        };
        
        self.getEdm = function () {
            throw new Error("This was meant to be overridden.");
        };

    };

});
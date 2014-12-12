BASE.require([], function () {
    
    BASE.namespace("BASE.data.hooks");
    
    var Task = BASE.async.Task;
    var Future = BASE.async.Future;
    
    BASE.data.hooks.CascadeDelete = function (service) {
        
        var self = this;
        var edm = service.getEdm();
        self.execute = function (entity) {
            return new Future(function (setValue, setError) {
                
                // Clean house.
                var cleanTargets = function (relationship) {
                    return new Future(function (setValue, setError) {
                        var keyValue = entity[relationship.hasKey];
                        
                        if (relationship.optional !== true) {
                            service.asQueryable(relationship.ofType).where(function (e) {
                                return e.property(relationship.withForeignKey).isEqualTo(keyValue);
                            }).forEach(function (target) {
                                service.remove(target).then(setValue).ifError(setError);
                            });
                        }
                    });
                };
                
                var cleanManyToManySources = function (relationship) {
                    var keyValue = entity[relationship.hasKey];
                    
                    service.asQueryable(relationship.usingMappingType).where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(keyValue);
                    }).forEach(function (source) {
                        self.remove(source);
                    });

                };
                
                var cleanManyToManyTargets = function (relationship) {
                    var keyValue = entity[relationship.withKey];
                    
                    service.asQueryable(relationship.usingMappingType).where(function (e) {
                        return e.property(relationship.hasForeignKey).isEqualTo(keyValue);
                    }).forEach(function (target) {
                        self.remove(target);
                    });

                };
                
                var task = new Task();
                edm.getOneToOneRelationships(entity).reduce(cleanTargets, task);
                edm.getOneToManyRelationships(entity).reduce(cleanTargets, task);
                
                edm.getManyToManyRelationships(entity).reduce(cleanManyToManySources, task);
                edm.getManyToManyAsTargetRelationships(entity).reduce(cleanManyToManyTargets, task);

                task.start().whenAll(setValue);

            });
        };

    };
});
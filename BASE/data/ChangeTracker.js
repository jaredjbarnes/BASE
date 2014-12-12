BASE.require([
    "BASE.util.PropertyBehavior",
    "BASE.util.Observable",
    "BASE.data.responses.ServiceResponse",
    "BASE.data.utils"
], function () {
    
    BASE.namespace("BASE.data");
    
    var emptyFn = function () { };
    var Future = BASE.async.Future;
    var ServiceResponse = BASE.data.responses.ServiceResponse;
    var Observable = BASE.util.Observable;
    
    var isPrimitive = BASE.data.utils.isPrimitive;
    
    BASE.data.ChangeTracker = function (entity, service) {
        var self = this;
        var changeTracker = self;
        
        Observable.call(self);
        
        BASE.util.PropertyBehavior.call(entity);
        
        var edm = service.getEdm();
        var updateHash = {};
        var restoreHash = {};
        var primaryKeys = {};
        
        edm.getPrimaryKeyProperties(entity.constructor).forEach(function (key) {
            primaryKeys[key] = true;
        });
        
        var oneToOne = edm.getOneToOneRelationships(entity);
        var oneToManyAsTarget = edm.getOneToOneRelationships(entity);
        
        var observer = entity.observe();
        observer.filter(function (e) {
            return e.type === "propertyLoad";
        }).onEach(function (e) {
            restoreHash[e.property] = e.newValue;
        });
        
        observer.filter(function (e) {
            if (e.type === "propertyChange") {
                if (typeof restoreHash[e.property] === "undefined") {
                    restoreHash[e.property] = e.oldValue;
                }
                if (isPrimitive(e.oldValue) &&
                    isPrimitive(e.newValue)) {
                    return true;
                }
            }
            return false;
        }).onEach(function (e) {
            
            if (!primaryKeys[e.property]) {
                updateHash[e.property] = e.newValue;
            }
            
            self.update();
        });
        
        var sync = function (dto) {
            observer.stop();
            
            Object.keys(dto).forEach(function (key) {
                var value = dto[key];
                if (isPrimitive(dto[key]) && isPrimitive(entity[key])) {
                    entity[key] = value;
                }
            });
            
            observer.start();
        };
        
        var BaseState = function () {
            var self = this;
            self.add = emptyFn;
            self.update = emptyFn;
            self.remove = emptyFn;
            
            self.sync = sync;
            
            self.save = function () {
                throw new Error("This should be overridden.");
            };
            
            self.revert = function () {
                throw new Error("This should be overriden.");
            };
        };
        
        var savingFuture = null;
        var savingState = {
            add: emptyFn,
            update: emptyFn,
            remove: emptyFn,
            sync: sync,
            save: function () {
                return savingFuture;
            },
            revert: function () {
                throw new Error("Cannot revert while saving.");
            }
        };
        
        var LoadedState = function () {
            var self = this;
            
            self.update = function () {
                changeTracker.setStateToUpdated();
            };
            
            self.remove = function () {
                changeTracker.setStateToRemoved();
            };
            
            self.save = function () {
                return Future.fromResult(new ServiceResponse("Nothing to save."));
            };
            
            self.revert = emptyFn;
        };
        LoadedState.prototype = new BaseState();
        
        var AddedState = function () {
            var self = this;
            
            self.remove = function () {
                changeTracker.setStateToDetached();
            };
            
            self.save = function (service) {
                var future = service.add(entity);
                setStateToSaving(future);
                
                future.then(function (response) {
                    var dto = response.entity;
                    
                    var primaryKeys = edm.getPrimaryKeyProperties(entity.constructor);
                    primaryKeys.forEach(function (key) {
                        entity[key] = dto[key];
                    });
                    
                    state.sync(dto);
                    updateHash = {};
                    restoreHash = {};
                    changeTracker.setStateToLoaded();
                }).ifError(function (errorResponse) {
                    // Do nothing for now.
                    changeTracker.setStateToAdded();
                });
                
                return future;

            };
            
            self.revert = function () {
                changeTracker.setStateToDetached();
            };
        };
        AddedState.prototype = new BaseState();
        
        var UpdatedState = function () {
            var self = this;
            self.remove = function () {
                changeTracker.setStateToRemoved();
            };
            self.save = function (service) {
                var updates = {};
                
                Object.keys(updateHash).forEach(function (key) {
                    if (updateHash[key] instanceof Date) {
                        updates[key] = new Date(updateHash[key]);
                    } else {
                        updates[key] = updateHash[key];
                    }
                });
                
                BASE.clone(updateHash, true);
                
                updateHash = {};
                
                var future = service.update(entity, updates);
                setStateToSaving(future);
                
                future.then(function () {
                    restoreHash = {};
                    changeTracker.setStateToLoaded();
                }).ifError(function (errorResponse) {
                    // This will capture any updates that may have happened while trying to save.
                    Object.keys(updateHash).forEach(function (key) {
                        updates[key] = updateHash[key];
                    });
                    updateHash = updates;
                    changeTracker.setStateToUpdated();

                });
                
                return future;
            };
            
            self.revert = function () {
                Object.keys(restoreHash).forEach(function (key) {
                    entity[key] = restoreHash[key];
                });
                restoreHash = {};
                changeTracker.setStateToLoaded();
            };
        };
        UpdatedState.prototype = new BaseState();
        
        var RemovedState = function () {
            var self = this;
            self.add = function () {
                if (Object.keys(updateHash).length > 0) {
                    changeTracker.setStateToUpdated();
                } else {
                    changeTracker.setStateToLoaded();
                }
            };
            self.save = function (service) {
                var future = service.remove(entity);
                
                setStateToSaving(future);
                
                future.then(function () {
                    entity.id = null;
                    updateHash = {};
                    changeTracker.setStateToDetached();
                }).ifError(function () {
                    changeTracker.setStateToRemoved();
                });
                
                return future;
            };
            self.revert = function () {
                Object.keys(restoreHash).forEach(function (key) {
                    entity[key] = restoreHash[key];
                });
                
                restoreHash = {};
                changeTracker.setStateToLoaded();
            };
        };
        RemovedState.prototype = new BaseState();
        
        var DetachedState = function () {
            var self = this;
            
            self.add = function () {
                changeTracker.setStateToAdded();
            };
            
            self.save = function () {
                // Should we throw an error or simply ignore?
                throw new Error("This should have never been called, because the state is detached.");
            };
            self.revert = function () {
                // Should we throw an error or simply ignore?
                throw new Error("This should have never been called, because the state is detached.");
            };
        };
        DetachedState.prototype = new BaseState();
        
        var loadedState = new LoadedState();
        var addedState = new AddedState();
        var removedState = new RemovedState();
        var updatedState = new UpdatedState();
        var detachedState = new DetachedState();
        
        var setStateToSaving = function (future) {
            savingFuture = future;
            state = savingState;
            self.notify({
                type: "saving"
            });
        };
        
        self.setStateToDetached = function () {
            state = detachedState;
            observer.dispose();
            self.notify({
                type: "detached"
            });
        };
        
        self.setStateToLoaded = function () {
            state = loadedState;
            self.notify({
                type: "loaded"
            });
        };
        
        self.setStateToAdded = function () {
            state = addedState;
            self.notify({
                type: "added"
            });
        };
        
        self.setStateToRemoved = function () {
            state = removedState;
            self.notify({
                type: "removed"
            });
        };
        
        self.setStateToUpdated = function () {
            state = updatedState;
            self.notify({
                type: "updated"
            });
        };
        
        var state = detachedState;
        
        self.add = function () {
            return state.add();
        };
        
        self.remove = function () {
            return state.remove();
        };
        
        self.update = function () {
            return state.update();
        };
        
        self.sync = function (dto) {
            return state.sync(dto);
        };
        
        self.save = function (service) {
            return state.save(service);
        };
        
        self.revert = function () {
            return state.revert();
        };

    };

});
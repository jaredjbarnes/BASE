BASE.require([
    "BASE.async.Future",
    "Date.fromISO"
], function () {
    BASE.namespace("BASE.data.states");
    
    var Future = BASE.async.Future;
    
    // Turn a string into possible other types, like Date
    var getValue = function (value) {
        
        var returnValue = value;
        
        // try for a date
        // Looks for an ISO_8601 compliant date
        // http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
        // var dateRegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
        // That regexp might be too greedy, in that it will match "2009" which, in our case, is probably an int
        // We'll use a much more specific model, since we know what a date looks like from the server.
        var dateRegex = /\d{4}-\d{2}-\d{2}/;
        if (dateRegex.test(value)) {
            returnValue = Date.fromISO(value);
        }
        
        // Want to test for anything else?  Do it here.
        
        return returnValue;
    };
    
    BASE.data.states.AbstractState = (function (Super) {
        var AbstractState = function (changeTracker, relationManager) {
            var self = this;
            
            BASE.assertNotGlobal(self);
            
            var entity = changeTracker.entity;
            
            self.add = function () {
                // Do nothing.
            };
            
            self.remove = function () {
                // Do nothing.
            };
            
            self.update = function (event) {
                // Do nothing.
            };
            
            self.save = function () {
                return new Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue({ message: "No saving necessary." });
                    }, 0);
                });
            };
            
            self.sync = function (dto) {
                var dataContext = changeTracker.getDataContext();
                entity._synced = false;
                
                // Update the entity to the values in the dto.
                // Run through each property and assign the entity that value.
                Object.keys(dto).forEach(function (key) {
                    if (typeof entity[key] === "undefined" || key === "constructor") {
                        return;
                    }
                    
                    if (Array.isArray(entity[key])) {
                        //Load meta data to the array object.
                        var array = entity[key];
                        Object.keys(dto[key]).forEach(function (property) {
                            // This could cause problems, with bad programming practices. :(  for(var x in array) won't work. 
                            array[property] = dto[key][property];
                        });
                        
                        // We need to set the array up with a type.
                        // This is a convenience for the developer, so they don't have to say asQueryable(Type).
                        var oneToMany = dataContext.getOrm().oneToManyRelationships.get(entity.constructor, key);
                        var manyToMany = dataContext.getOrm().manyToManyRelationships.get(entity.constructor, key);
                        var manyToManyAsTargets = dataContext.getOrm().manyToManyTargetRelationships.get(entity.constructor, key);
                        
                        var TargetType;
                        if (oneToMany || manyToMany) {
                            TargetType = oneToMany ? oneToMany.ofType : manyToMany.ofType;
                        } else if (manyToManyAsTargets) {
                            TargetType = manyToManyAsTargets.type;
                        }
                        
                        array.Type = TargetType;

                    } else if (typeof dto[key] === 'object' && dto[key] !== null) {
                        var Type = dataContext.getService().getTypeForDto(dto[key]);
                        var dataSet = dataContext.getDataSet(Type);
                        
                        // Create a mostly-dummy object and don't tell anybody
                        entity[key] = dataSet.loadStub(dto[key]);
                    } else if (typeof dto[key] === "string") {
                        entity[key] = getValue(dto[key]);
                    } else if (typeof dto[key] === "number") {
                        entity[key] = dto[key];
                    } else if (typeof dto[key] === "boolean") {
                        entity[key] = dto[key];
                    }
                });
                entity._synced = true;
                entity.notify({ type: "synced" });
            };
            
            self.start = function () {
                // Do nothing.
            };
            
            self.stop = function () {
                // Do nothing.
            };
            
            return self;
        };
        
        BASE.extend(AbstractState, Super);
        
        return AbstractState;
    }(Object));
});
(function(BASE){

    var Event = function (type) {
         if (!(this instanceof Event)) {
           return new Event(type);
         }
        
         var event = this;
         event.__defineGetter__("type", function(){return type;});
        
       };
      
      
       BASE.makeClassObservable = function (OldClass) {   
         if (typeof OldClass !== "function"){
           throw new Error("Expected a constructor as the first argument.");
         }
        
         //Create a new constructor and return it.
         var NewClass = function () {
           var instance = this;
          
           //Old Class
           if (Object !== OldClass) {
             OldClass.apply(this, arguments);
           }
          
           //Listener object.
           var propertyListeners = {};
           var changeListeners = [];
           instance.Event = Event;
          
           //Emits a property change event, and invokes callbacks.
           instance.notifyObservers = function (event) {
             if (event instanceof Event && instance.notifyObservers.enabled) {
              
               for (var y = 0 ; y < changeListeners.length ; y++){
                 changeListeners[y].apply(instance, arguments);
               }
              
               var listenerArray = propertyListeners[event.type];
               if (listenerArray) {
                 for (var x = 0; x < listenerArray.length; x++) {
                   listenerArray[x].apply(instance, arguments);
                 }
               }
              
             }
           };
          
           instance.notifyObservers.enabled = true;
          
           //Adds listeners
           instance.observe = function (type, callback) {
             if (arguments.length === 2){
               if (!propertyListeners[type]) {
                 propertyListeners[type] = [];
               }
              
               propertyListeners[type].push(callback);
             } else if (typeof type === "function"){
               changeListeners.push(type);
             }
           };
          
           //Emits the property callback once and then removes it for you.
           instance.observeOnce = function (type, callback) {
             callback = callback || type;
            
             if (arguments.length === 2){
               var once = function (e) {
                 callback.apply(this, arguments);
                 instance.unobserve(type, once);
               };x
              
               instance.observe(type, once);
             } else if (arguments.length === 1) {
               var once = function(e){
                 callback.apply(this, arguments);
                 instance.unobserve(once);
               };
               instance.observe(once);
             }
            
           };
          
           //You can remove all listeners of a specified type or refer to a specific listener to remove.
           instance.unobserve = function (type, callback) {
             if (callback && typeof type === "string" &&  propertyListeners[type]) {
               var listenerArray = propertyListeners[type];
              
               var index = listenerArray.indexOf(callback);
               if (index>-1){
                 listenerArray.splice(index,1);
               }
              
             } else if (typeof type === "function"){
               for (var a in propertyListeners){
                 var index = propertyListeners[a].indexOf(type);
                 if (index > -1){
                   propertyListeners[a].splice(index,1);
                 }
               }
               index = changeListeners.indexOf(type);
               if (index > -1){
                 changeListeners.splice(index,1);
               }
             } else if (typeof type === "string" && typeof callback === "undefined") {
               propertyListeners[type] = [];
             }
           };
          
           //This is the object where we store the variable values.
           var variables = {};
          
           //For loop wrapped with an instant invocation of an anonomous function to preserve scope.
           for (var x in instance) (function (x) {
             if (typeof instance[x] !== 'function') {
               variables[x] = instance[x];
               
               var descriptor = Object.getOwnPropertyDescriptor(instance, x);
               
               var hasGetter = descriptor.get;
               var hasSetter = descriptor.set;
              
               //If it has a getter already, then let the getter handle the response.
               if (hasGetter) {
                 
                 Object.defineProperty(instance, x, {
                    enumerable: true,
                    configurable: true,
                    get: hasGetter
                 });
                 
               } else {
                 Object.defineProperty(instance, x, {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return variables[x];
                    }
                 });
               }
              
               if (hasSetter) {
                 
                 Object.defineProperty(instance, x, {
                    writable: true,
                    enumerable: true,
                    configurable: true,
                    set: function (val) {
                        var fireEvents = instance.notifyObservers.enabled;
                        
                  
                        if (fireEvents) {
                            instance.notifyObservers.enabled = false;
                        };
                  
                        hasSetter.apply(instance, arguments);
                        if (fireEvents) {
                            instance.notifyObservers.enabled = true;
                        }
                  
                        //Trigger event
                        if (oldValue !== val && instance[x]===val){
                            var oldValue = variables[x];
                            var event = new Event(x);
                        
                            Object.defineProperties(event, {
                                "newValue": {
                                    get: function(){
                                        return val;
                                    },
                                    enumerable: true
                                },
                                "oldValue": {
                                    get: function(){
                                        return oldValue;
                                    },
                                    enumerable: true
                                },
                                "property": {
                                    get: function(){
                                        return x;
                                    },
                                    enumerable: true
                                },
                                "target": {
                                    get: function(){
                                        return instance;
                                    },
                                    enumerable: true
                                }
                            });
                        
                            instance.notifyObservers(event);
                        }
                    }
                 });
                 
               } else if (!hasGetter && !hasSetter) {
                 
                   
                   Object.defineProperty(instance, x, {
                        set: function (val) {
                            variables[x] = val;
                            //Trigger event
                            if (oldValue !== val){
                                var event = new Event(x);
                                var oldValue = variables[x];
                                var event = new Event(x);
                    
                                Object.defineProperties(event, {
                                    "newValue": {
                                        get: function(){
                                            return val;
                                        },
                                        enumerable: true
                                    },
                                    "oldValue": {
                                        get: function(){
                                            return oldValue;
                                        },
                                        enumerable: true
                                    },
                                    "property": {
                                        get: function(){
                                            return x;
                                        },
                                        enumerable: true
                                    },
                                    "target": {
                                        get: function(){
                                            return instance;
                                        },
                                        enumerable: true
                                    }
                                });
                                
                                instance.notifyObservers(event);
                            }
                    
                        }
                   });
                   
                 
               }
             }
           })(x);
          
           return instance;
         };
        
         var oldClass = new OldClass();
         NewClass.prototype = oldClass;
        
         return NewClass;
       };
})(BASE);
BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayVisitor",
    "BASE.query.Queryable",
    "BASE.async.Future",
    "BASE.async.Task"
], function () {
    BASE.namespace("BASE.query");
    
    var ArrayVisitor = BASE.query.ArrayVisitor;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var Future = BASE.async.Future;
    
    BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function (array) {
            var self = this;
            BASE.assertNotGlobal(self);
            
            Super.call(self, array);
            
            self.toArray = function (queryable) {
                var self = this;
                return new Future(function (setValue, setError) {
                    var Type = queryable.Type;
                    var parser = new ArrayVisitor(array);
                    
                    var expression = queryable.getExpression();
                    
                    parser.parse(expression.where);
                    parser.parse(expression.skip);
                    parser.parse(expression.take);
                    parser.parse(expression.orderBy);
                    
                    setTimeout(function () {
                        setValue(parser.getValue());
                    }, 0);
                });
            };
            
            self.execute = self.toArray;
        };
        
        BASE.extend(ArrayProvider, Super);
        
        return ArrayProvider;
    }(BASE.query.Provider));

});
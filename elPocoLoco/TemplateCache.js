BASE.require(["node.File"], function () {

    BASE.namespace("elPocoLoco");

    var Future = BASE.async.Future;

    var Template = function (source) {
        var literalRegEx = /\$(.*?)\$/g;
        this.createInstance = function (scope) {
            return source.replace(literalRegEx, function (match, value) {
                return BASE.getObject(value, scope);
            });
        };
    };

    elPocoLoco.TemplateCache = function () {
        var loadedTemplates = {};
        this.get = function (path) {
            if (loadedTemplates[path]) {
                return loadedTemplates[path];
            } else {
                return loadedTemplates[path] = new Future(function (setValue, setError) {
                    new node.File(path).read("utf8").then(function (template) {
                        setValue(new Template(template));
                    });
                });
            }
        };
    };



});
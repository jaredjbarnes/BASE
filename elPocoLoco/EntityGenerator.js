BASE.require([
    "node.File",
    "node.Directory"
], function () {

    BASE.namespace("elPocoLoco");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var File = node.File;
    var Directory = node.Directory;

    var toArray = function (arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
    };

    var defaultValues = {
        "Edm.Int64": 0,
        "Edm.DateTime": null,
        "Edm.Decimal": 0,
        "Edm.String": null,
        "Edm.Boolean": false,
    };

    var edmToJavascript = {
        "Edm.Int64": "Number",
        "Edm.DateTime": "Date",
        "Edm.Decimal": "Number",
        "Edm.String": "String",
        "Edm.Boolean": "Boolean",
    }

    var getDefaultValue = function (propertyElement) {
        var nullable = propertyElement.getAttribute("Nullable");
        var type = propertyElement.getAttribute("Type");
        var name = propertyElement.getAttribute("Name");

        if (nullable || name === "Id") {
            return null;
        } else {
            return defaultValues[type] || null;
        }
    };

    elPocoLoco.EntityGenerator = function (dom, templateCache) {
        var self = this;

        var buildEntity = function (entityElement, namespaceArray) {

            return new Future(function (setValue, setError) {
                var task = new Task();

                task.add(
                    templateCache.get("./PocoTemplate.js"),
                    templateCache.get("./PropertyTemplate.js")
                    );

                task.start().whenAll(function (futures) {
                    var pocoTemplate = futures[0].value;
                    var propertyTemplate = futures[1].value;
                    var mirrorTemplate = futures[2].value;
                    var definePropertiesTemplate = futures[3].value;
                    var className = entityElement.getAttribute("Name");
                    var fullNamespaceArray = namespaceArray.slice(0);
                    var fullNamespace = fullNamespaceArray.join(".");
                    var baseClassName = entityElement.getAttribute("BaseType") || "Object";
                    var dependencies = [baseClassName];

                    var properties = [];

                    fullNamespaceArray.push(className);

                    toArray(entityElement.querySelectorAll("Property")).forEach(function (propertyElement) {
                        var property = propertyElement.getAttribute("Name");
                        var Type = propertyElement.getAttribute("Type");

                        properties.push(propertyTemplate.createInstance({
                            property: property,
                            value: getDefaultValue(propertyElement)
                        }));

                    });

                    var poco = pocoTemplate.createInstance({
                        dependencies: "[\"" + dependencies.join("\",\"") + "\"]",
                        baseName: baseClassName,
                        namespace: namespaceArray.join("."),
                        className: className,
                        properties: properties.join("\r\n\t\t")
                    });

                    setValue(poco);

                });
            });

        };

        self.generate = function () {
            return new Future(function (setValue, setError) {

                toArray(dom.querySelectorAll("Schema")).forEach(function (schemaElement) {
                    var namespace = schemaElement.getAttribute("Namespace");
                    var namespaceArray = namespace.split(".");

                    new Directory(namespace.replace(/\./g, "/")).create().then(function () {
                        var task = new Task();

                        toArray(schemaElement.querySelectorAll("EntityType")).forEach(function (entityElement) {

                            task.add(new Future(function (setValue, setError) {
                                var className = entityElement.getAttribute("Name");
                                var fullNamespaceArray = namespaceArray.slice(0);
                                fullNamespaceArray.push(className);
                                var path = fullNamespaceArray.join("/") + ".js";
                                buildEntity(entityElement, namespaceArray).then(function (file) {
                                    new File(path).write(file).then(setValue).ifError(setError);
                                });
                            }));

                        });

                        task.start().whenAll(setValue);

                    });
                });
            });

        };
    };

});
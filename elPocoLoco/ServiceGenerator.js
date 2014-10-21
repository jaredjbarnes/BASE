BASE.require([], function () {

    BASE.namespace("elPocoLoco");

    var Future = BASE.async.Future;

    var toArray = function (arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
    };

    var createAssociationFinder = function (document) {
        return function (name) {
            return document.querySelector("Association[Name='" + name + "']");
        };
    };

    Document.prototype.makeRelationship = function (relationship) {
        /// <signature>
        /// <param type="String" name="relationship">The Relationship attribute found on the NavigationProperty element.</param>
        /// </signature>

        var document = this;
        var assocation = getAssociationFromRelationship(relationship);

        var sourceRole = assocation + "_Source";
        var targetRole = assocation + "_Target";
        var sourceElement = docuemnt.querySelectorAll("NavigationProperty[Relationship='" + relationship + "'][ToRole='" + sourceRole + "]");
        var targetElement = docuemnt.querySelectorAll("NavigationProperty[Relationship='" + relationship + "'][ToRole='" + targetRole + "]");

        var sourceMultiplicity = this.getMultiplicity(sourceRole);
        var targetMultiplicity = this.getMultiplicity(targetRole);

        var keys = this.getAssociationKeys(assocation);



        return {
            sourceProperty: sourceElement.getAttribute("Name"),
            targetElement: targetElement.getAttribute("Name")
        };
    };

    Document.prototype.getMultiplicity = function (roleName) {
        return this.querySelector("Association > End[Role='" + roleName + "']").getAttribute("Multiplicity");
    };

    Document.prototype.getAssociationKeys = function (association) {
        var associationElement = this.querySelector("Association[Name='" + association + "']");
        if (!associationElement) {
            throw new Error("Couldn't find association.");
        }
        var sourceKey = associationElement.querySelector("Principle > PropertyRef").getAttribute("Name");
        var targetKey = associationElement.querySelector("Dependent > PropertyRef").getAttribute("Name");

        return {
            hasKey: sourceKey,
            withForeignKey: targetKey
        };
    };

    Element.prototype.getKey = function (entityTypeElement) {
        return this.querySelector("Key > PropertyRef").getAttribute("Name");
    };

    Element.prototype.getAssociation = function () {
        if (this.hasAttribute("Relationship")) {
            return getAssociationFromRelationship(this.getAttribute("Relationship"));
        } else {
            return null;
        }
    };

    var getAssociationFromRelationship = function (relationship) {
        /// <signature>
        /// <param type="String" name="relationship">The Relationship attribute found on the NavigationProperty element.</param>
        /// </signature>

        var parts = relationship.split(".");
        return parts.slice(parts.length - 1)[0];
    };

    var makeRelationship = function (relationship) { };

    elPocoLoco.ServiceGenerator = function (dom, templateCache) {
        var self = this;

        BASE.assertNotGlobal(self);

        var associationFinder = createAssociationFinder(dom);

        self.generate = function () {
            return new Future(function (setValue, setError) {

                toArray(dom.querySelectorAll("Schema")).forEach(function (schemaElement) {
                    var namespace = schemaElement.getAttribute("Namespace");
                    var namespaceArray = namespace.split(".");

                    new Directory(namespace.replace(/\./g, "/")).create().then(function () {
                        var task = new Task();

                        toArray(schemaElement.querySelectorAll("EntityType")).forEach(function (entityElement) {
                            toArray(entityElement.querySelectorAll("NavigationProperty")).forEach(function (navigationElement) {

                                var relationship = navigationElement.getAttribute("Relationship");
                                var name = navigationElement.getAttribute("Name");
                                var associationElement = associationFinder(relationship);

                            });
                        });
                    });
                });

            });
        };
    };

});
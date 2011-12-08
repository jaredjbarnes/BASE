(function () {
    BASE.namespace("leavitt");

    var Person = function (options) {
        options = options || {};

        var person = this;
        this.firstName = options.firstName || null;
        this.lastName = options.lastName || null;
        this.email = options.email || null;
        this.phone = options.phone || null;
        this.workPhone = options.workPhone || null;
        this.cellPhone = options.cellPhone || null;
        this.address = options.address || null;
        this.city = options.city || null;
        this.state = options.state || null;
        this.zip = options.zip || null;
        this.age = options.age || null;
    };

    leavitt.Person = Person;

})();
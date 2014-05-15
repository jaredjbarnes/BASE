BASE.namespace("BASE.data.responses");

BASE.data.responses.ServiceResponse = function (message) {
    var self = this;

    BASE.assertNotGlobal(self);
    self.message = message;

    self.toString = function () {
        return self.message;
    };

    return self;
};


BASE.require(["BASE.Observable", "BASE.PropertyChangedEvent"], function () {
    BASE.namespace("BASE.web.ui");

    BASE.web.ui.DataSource = (function (Super) {
        var DataSource = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataSource();
            }

            Super.call(self);

            self.numberOfItemsInSection = function (sectionNumber) {
                //Returns the number of items found within this section.
                throw new Error("\"itemsInSection\" was intended to be overridden by subclass.");
            };

            self.numberOfSections = function () {
                //Returns the number of sections found within this data source.
                throw new Error("\"numberOfSections\" was intended to be overridden by subclass.");
            };

            self.viewWithAttribute = function (attribute) {
                //This returns a Future<View>.
                throw new Error("\"viewWithAttribute\" was intended to be overridden by subclass.");
            };

            self.viewsWithAttributes = function (attributes) {
                //This returns a Task<Future<View>>.
                throw new Error("\"viewsWithAttributes\" was intended to be overridden by subclass.");
            };

            self.indexPathForItemId = function (id) {
                //This returns an indexPath for the item with id matching the parameters.
                throw new Error("\"viewsWithAttributes\" was intended to be overridden by subclass.");
            };

            self.uriWithReuseId = function (reuseId) {
                //This returns a uri for the given reuseId.
                throw new Error("\"uriWithReuseId\" was intended to be overridden by subclass.");
            };


            self.prepareViewForReuse = function (view) {
                //This allows the source to reset the view on the data.
            };

            // Event object has indexPath as a property.
            self.onItemInserted = function (callback) {
                self.observe(callback, "itemInserted");
            };

            // Event object has indexPath as a property.
            self.onItemRemoved = function (callback) {
                self.observe(callback, "itemRemoved");
            }

            // Event object has section as a property.
            self.onSectionInserted = function (callback) {
                self.observe(callback, "sectionInserted");
            };

            // Event object has section as a property.
            self.onSectionRemoved = function (callback) {
                self.observe(callback, "sectionRemoved");
            }

            self.onChange = function (callback) {
                self.observe(callback, "change");
            };

            // Event object has indexPath as a property.
            self.removeOnItemInserted = function (callback) {
                self.unobserve(callback, "itemInserted");
            };

            // Event object has indexPath as a property.
            self.removeOnItemRemoved = function (callback) {
                self.unobserve(callback, "itemRemoved");
            }

            // Event object has section as a property.
            self.removeOnSectionInserted = function (callback) {
                self.unobserve(callback, "sectionInserted");
            };

            // Event object has section as a property.
            self.removeOnSectionRemoved = function (callback) {
                self.unobserve(callback, "sectionRemoved");
            };

            self.removeOnChange = function (callback) {
                self.unobserve(callback, "change");
            };

            return self;
        };

        BASE.extend(DataSource, Super);

        return DataSource;
    }(BASE.Observable));
});
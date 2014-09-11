BASE.require([
    "BASE.data.PersistentState"
], function () {

    BASE.namespace("BASE.data");

    var Future = BASE.async.Future;
    var PersistentState = BASE.data.PersistentState;
    var emptyFn = function () { };

    var EmptyState = function (currentState, dataStore) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = function (entity) {
            var json = JSON.stringify(entity);
            currentState.state = "added";
            currentState.json = json;
            dataStore.add(currentState).then();
        };

        self.remove = function () {
            currentState.state = "removed";
            dataStore.add(currentState).then();
        };

        self.update = function (updates) {
            var json = JSON.stringify(updates);
            currentState.json = json;
            currentState.state = "updated";
            dataStore.add(currentState);
        };

    };


    var AddedState = function (currentState, dataStore) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = emptyFn;

        self.update = function (updates) {
            var data = JSON.parse(currentState.json);
            Object.keys(updates).forEach(function (key) {
                data[key] = updates[key];
            });
            dataStore.update(currentState, { json: JSON.stringify(data) }).then();
        };

        self.remove = function () {
            dataStore.remove(currentState).then();
        };
    };

    var UpdatedState = function (currentState, dataStore) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = emptyFn;

        self.update = function (updates) {
            var data = JSON.parse(currentState.json);
            Object.keys(updates).forEach(function (key) {
                data[key] = updates[key];
            });
            dataStore.update(currentState, { json: JSON.stringify(data) }).then();
        };

        self.remove = function () {
            dataStore.update(currentState, { state: "removed" }).then();
        };
    };

    var RemovedState = function (currentState, dataStore) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = function () {
            dataStore.remove(currentState).then();
        };;

        self.update = emptyFn;
        self.remove = emptyFn;
    };

    constructorByState = {
        added: AddedState,
        updated: UpdatedState,
        removed: RemovedState
    };

    BASE.data.PersistentChangeTracker = function (service, persistenceDataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        var self = this;

        var loadState = function (primaryKey, tableName) {
            return new Future(function (setValue, setError) {

                dataStore.asQueryable().where(function (e) {
                    return e.and(
                        e.property("primaryKey").isEqualTo(primaryKey),
                        e.property("tableName").isEqualTo(tableName)
                        );
                }).firstOrDefault().then(function (state) {
                    var Type;

                    if (state === null) {
                        Type = EmptyState;
                        var state = new PersistentState();
                        state.primaryKey = primaryKey;
                        state.tableName = tableName;

                    } else {
                        Type = constructorByState[state.state];
                    }

                    var stateInstance = new Type(state, dataStore);
                    setValue(stateInstance);
                });

            });
        };

        service.observeType("added", function (event) {
            loadState(event.primaryKey, event.tableName).then(function (state) {
                state.add(JSON.stringify(event.entity));
            });
        });

        service.observeType("removed", function (event) {
            loadState(event.primaryKey, event.tableName).then(function (state) {
                state.remove();
            });
        });

        service.observeType("updated", function (event) {
            loadState(event.primaryKey, event.tableName).then(function (state) {
                state.update(JSON.stringify(event.updates));
            });
        });

    };

});
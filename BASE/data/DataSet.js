BASE.require([
    "BASE.Observable",
    "BASE.ObservableArray",
    "BASE.Hashmap",
    "BASE.ObservableEvent",
    "BASE.Future"
], function () {

    BASE.namespace("BASE.data");

    BASE.data.DataSet = (function (Super) {

        var DataSet = function (Type, context) {
            var self = this;
            if (!(self instanceof DataSet)) {
                return new DataSet(Type, context);
            }

            Super.call(self);

            var _entitiesById = new BASE.Hashmap();
            var _arrayObservers = new BASE.Hashmap();
            var _observers = new BASE.Hashmap();
            var _entitiesByNoId = new BASE.Hashmap();
            var _allEntities = new BASE.Hashmap();
            var _Type = Type;
            var _context = context;

            Object.defineProperties(self, {
                "local": {
                    get: function () {
                        var local = [];
                        _allEntities.getKeys().forEach(function (key) {
                            local.push(_allEntities.get(key));
                        });
                        return local;
                    },
                    enumerable: true,
                    configurable: true
                },
                "context": {
                    get: function () {
                        return _context;
                    },
                    enumerable: true,
                    configurable: true
                },
                "type": {
                    get: function () {
                        return _Type;
                    },
                    enumerable: true,
                    configurable: true
                }
            });

            var _loadEntity = function (entity) {
                if (!_allEntities.hasKey(entity)) {
                    _allEntities.add(entity, entity);

                    var event = new BASE.ObservableEvent("changed");
                    event.newItems = [entity];
                    event.oldItems = [];
                    self.notify(event);
                }
            };

            var _unloadEntity = function (entity) {
                if (_allEntities.hasKey(entity)) {
                    _allEntities.remove(entity, entity);

                    var event = new BASE.ObservableEvent("changed");
                    event.newItems = [];
                    event.oldItems = [entity];
                    self.notify(event);
                }
            };

            var _getTrackedEntity = function (entity) {
                var self = this;
                var noId = _entitiesByNoId.get(entity);
                var byId = _entitiesById.get(entity.id);
                if (!noId && !byId) {
                    return entity;
                } else if (noId) {
                    return noId;
                } else if (byId) {
                    return byId;
                }
            };

            self.checkForEntity = _getTrackedEntity;

            self.loadEntity = function (entity) {
                var loadedEntity = _getTrackedEntity(entity);

                if (loadedEntity.id) {
                    _entitiesById.add(loadedEntity.id, loadedEntity);
                    _context.load(loadedEntity);
                } else {
                    _entitiesByNoId.add(loadedEntity, loadedEntity);
                    _context.add(loadedEntity);
                }

                _loadEntity(entity);

                return loadedEntity;
            };

            self.add = function (entity) {
                var loadedEntity = _getTrackedEntity(entity);
                if (loadedEntity === entity && entity instanceof _Type && !this.has(entity)) {
                    if (entity.id) {
                        _entitiesById.add(entity.id, entity);
                        _context.add(entity);
                    } else {
                        _entitiesByNoId.add(entity, entity);
                        entity.observe(function onIdChanged(event) {
                            entity.unobserve(onIdChanged, "id");
                            _entitiesByNoId.remove(entity);
                            _entitiesById.add(entity.id, entity);
                        }, "id");
                        _context.add(entity);
                    }
                    _loadEntity(entity);
                }
                return loadedEntity;
            };

            self.remove = function (entity) {
                if (entity && entity instanceof _Type) {
                    _unloadEntity(entity);
                    _context.remove(entity);
                    _entitiesById.remove(entity.id);
                    _entitiesByNoId.remove(entity);
                }
                return entity;
            };

            // This can be used to update the dataSet, and not trigger a remove on the dataContext;
            self.unloadEntity = function (entity) {
                if (entity && entity instanceof _Type) {
                    _unloadEntity(entity);
                    _entitiesById.remove(entity.id);
                    _entitiesByNoId.remove(entity);
                }
            };

            self.has = function (entity) {
                if (entity instanceof _Type) {
                    if (_entitiesById.get(entity.id) || _entitiesByNoId.get(entity)) {
                        return true;
                    }
                    return false;
                }
            };

            self.load = function (filter) {
                return context.loadEntities(_Type, filter);
            };

            self.onChange = function (callback) {
                var self = this;
                self.observe(callback, "changed");
            };

            self.count = function (filter) {
                return _context.service.count(_Type, filter);
            }

        }

        BASE.extend(DataSet, Super);

        return DataSet;
    })(BASE.Observable);

});
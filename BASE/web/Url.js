BASE.namespace("BASE.web");

BASE.web.Url = (function () {
    //URL Class start.
    var Url = function (url) {
        var self = this;

        if (!(self instanceof Url)) {
            return new Url(url);
        }

        return this;
    };

    Url.parse = function (url) {
        var instance = new Url();
        //Thanks Douglas Crockford.
        var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        var result = parse_url.exec(url);
        if (result) {
            Object.defineProperties(instance, {
                "href": {
                    get: function () {
                        return result[0];
                    }
                },
                "scheme": {
                    get: function () {
                        return result[1];
                    }
                },
                "slash": {
                    get: function () {
                        return result[2];
                    }
                },
                "host": {
                    get: function () {
                        return result[3];
                    }
                },
                "port": {
                    get: function () {
                        if (!result[4]) {
                            return result[1] === 'https' ? 443 : 80;
                        } else {
                            return parseInt(result[4], 10);
                        }
                    }
                },
                "path": {
                    get: function () {
                        return result[5];
                    }
                },
                "query": {
                    get: function () {
                        if (result[6]) {
                            var itemArray = result[6].split("&");
                            var nameValue;
                            var obj = {};
                            for (var x = 0; x < itemArray.length; x++) {
                                nameValue = itemArray[x].split("=");
                                obj[decodeURI(nameValue[0])] = decodeURI(nameValue[1]);
                            }
                            return obj;
                        }
                        return undefined;
                    }
                },
                "hash": {
                    get: function () {
                        return result[7];
                    }
                },
                "page": {
                    get: function () {
                        var tmpArray;
                        if (result[5]) {
                            tmpArray = result[5].split("/");
                            return tmpArray[tmpArray.length - 1];
                        } else {
                            return undefined;
                        }
                    }
                },
                "extension": {
                    get: function () {
                        var page = instance.page;
                        if (page) {
                            var regExp = /\.[^\.]*?$/i;
                            var value = page.match(regExp);
                            return value ? value[0] : undefined;
                        } else {
                            return undefined;
                        }
                    }
                }
            });
        }
        return instance;
    };

    return Url;
}());


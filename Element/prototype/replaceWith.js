BASE.require([
    "jQuery",
    "BASE.async.Future"
], function () {

    var htmlFutures = {};

    Element.prototype.replaceWith = function (url, beforeAppend, afterAppend) {
        var element = this;
        beforeAppend = beforeAppend || function () { };
        afterAppend = afterAppend || function () { };

        var build = function (html) {
            var parent = element.parentNode;
            if (parent !== null) {
                var domAttribute;
                var newElement = $(html)[0];

                // Apply attributes that were on the previous element.
                for (var x = 0 ; x < element.attributes.length; x++) {
                    domAttribute = element.attributes.item(x);
                    $(newElement).attr(domAttribute.nodeName, domAttribute.nodeValue);
                }

                beforeAppend(newElement);
                parent.replaceChild(newElement, element);
                afterAppend(newElement);
            }
        };

        var success = function (html) {
            build(html);
        };
        var error = function (e) {
            throw e;
        };

        var future;
        if (!htmlFutures[url]) {
            future = htmlFutures[url] = new BASE.async.Future(function (setValue, setError) {
                jQuery.ajax({
                    url: url,
                    type: "GET",
                    dataType: "html",
                    success: function (html) {
                        setValue(html);
                    },
                    error: function () {
                        setError(new Error("Error while trying to retrieve url: " + url));
                    }

                });
            });
        } else {
            future = htmlFutures[url];
        }
        future.then(success).ifError(error);
    };

});
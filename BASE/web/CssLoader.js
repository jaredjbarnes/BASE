BASE.require([], function () {
    BASE.namespace("BASE.web");

    var futureCss = {};
    BASE.web.CssLoader = function () {
        var self = this;

        var loadCss = function (url) {
            if (futureCss[url]) {
                return futureCss;
            } else {
                return futureCss[url] = new BASE.async.Future(function (setValue, setError) {
                    var link = document.createElement('link');
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = url;

                    link.onerror = function () {
                        setError(new Error("Couldn't find css at url: " + url));
                        console.log("Couldn't find css at url: " + url);
                    };
                    link.onload = setValue;
                    document.getElementsByTagName('head')[0].appendChild(link);
                });
            }
        };

        self.load = function (urls) {
            return new BASE.async.Future(function (setValue, setError) {
                var task = new BASE.async.Task();
                urls.forEach(function (url) {
                    task.add(loadCss(url));
                });
                task.start().whenAll(setValue);
            }).then();
        };
    };

});
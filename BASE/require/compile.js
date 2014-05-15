BASE.require([
    "BASE.async.Future",
    "BASE.async.Task"
], function () {
    var GET = function (url, settings) {
        settings = settings || {};
        settings.headers = settings.headers || {};

        return new BASE.async.Future(function (setValue, setError) {

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (event) {
                if (xhr.readyState == 4) {
                    if (xhr.status < 300 && xhr.status >= 200) {
                        setValue(xhr.responseText);
                    } else {
                        var error = new Error(status);
                        error.xhr = xhr;
                        error.message = "Error";
                        setError(error);
                    }
                }
            }

            xhr.open("GET", url, true);
            Object.keys(settings.headers).forEach(function (key) {
                xhr.setRequestHeader(key, settings.headers[key]);
            });

            xhr.send(settings.data);
        });
    };


    BASE.require.compile = function () {
        ///<summary>
        ///A method that compiles all scripts that have been loaded with BASE.require to this point.
        ///</summary>
        ///<returns type="undefined" >
        ///Returns undefined, and open a new tab with the compiled file.
        ///</returns>
        var dependencies = BASE.require.dependencyList;
        var task = new BASE.async.Task();

        dependencies.forEach(function (namespace) {
            if (namespace !== "BASE.require.compile" &&
                namespace !== "Object" &&
                namespace !== "Function" &&
                namespace !== "Date" &&
                namespace !== "Number" &&
                namespace !== "Array") {
                task.add(GET(BASE.require.loader.getPath(namespace)));
            }
        });

        task.start().whenAll(function (futures) {
            var compilation = [];
            futures.forEach(function (future) {
                compilation.push(future.value);
            });
            var encoded = encodeURI(compilation.join("\n"));
            location.href = "data:application/javascript;charset=utf-8," + encoded;
        });
    };
});